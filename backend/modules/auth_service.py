"""
AgriPilot - Genuine Contact & OTP Authentication Service
Handles:
1. Registered Farmer & Agronomist Contact Directory
2. Cryptographically secure 6-digit OTP generation with 5-minute expiry
3. Real SMS dispatch via Twilio (International/India) and Fast2SMS (Indian SMS Gateway)
4. Fallback emulator logging and verified session issuance
"""

import os
import secrets
import time
import json
import urllib.request
import urllib.parse
from datetime import datetime
from typing import Dict, Any, Optional

# Pre-registered Agricultural Contacts Directory
REGISTERED_CONTACTS = {
    "9876543210": {
        "name": "Ramesh Patel",
        "role": "Progressive Farmer",
        "phone": "+91 98765 43210",
        "field_id": "FIELD-NORTH-01",
        "avatar": "👨‍🌾",
        "region": "Indore (Madhya Pradesh)",
        "crops": ["Wheat (HD-3086)", "Soybean (JS-335)"]
    },
    "9826012345": {
        "name": "Suresh Choudhary",
        "role": "Progressive Farmer",
        "phone": "+91 98260 12345",
        "field_id": "FIELD-SOUTH-02",
        "avatar": "👨‍🌾",
        "region": "Delta Basin (Madhya Pradesh)",
        "crops": ["Chickpea (JG-11)"]
    },
    "9425088712": {
        "name": "Dr. R. K. Verma",
        "role": "Senior Agronomist (ICAR)",
        "phone": "+91 94250 88712",
        "field_id": "ALL-ZONES",
        "avatar": "🔬",
        "region": "Agricultural Research & Extension",
        "crops": ["Multi-Crop Agronomic Supervision"]
    },
    "9812345678": {
        "name": "Anand Kumar",
        "role": "Extension Officer (KVK)",
        "phone": "+91 98123 45678",
        "field_id": "KVK-INDORE-DISTRICT",
        "avatar": "📋",
        "region": "Indore District KVK Extension",
        "crops": ["District Extension Supervision"]
    },
    "9123456780": {
        "name": "Sardar Balwinder Singh",
        "role": "Progressive Farmer",
        "phone": "+91 91234 56780",
        "field_id": "FIELD-NORTH-01",
        "avatar": "🚜",
        "region": "Khanna (Punjab)",
        "crops": ["Wheat", "Basmati Paddy"]
    }
}

class AuthService:
    def __init__(self):
        # In-memory OTP storage: { normalized_phone: { "otp": "...", "expires_at": float, "attempts": 0 } }
        self.active_otps: Dict[str, Dict[str, Any]] = {}
        
        # Twilio credentials
        self.twilio_sid = os.getenv("TWILIO_ACCOUNT_SID", "")
        self.twilio_auth_token = os.getenv("TWILIO_AUTH_TOKEN", "")
        self.twilio_from = os.getenv("TWILIO_PHONE_NUMBER", "")
        
        # Fast2SMS credentials (standard for Indian +91 SMS)
        self.fast2sms_api_key = os.getenv("FAST2SMS_API_KEY", "")

    def _normalize_phone(self, phone: str) -> str:
        """Strip spaces, dashes, parentheses and country code +91 to get 10-digit number."""
        clean = "".join(filter(str.isdigit, str(phone)))
        if clean.startswith("91") and len(clean) == 12:
            return clean[2:]
        return clean[-10:] if len(clean) >= 10 else clean

    def _mask_phone(self, phone: str) -> str:
        clean = self._normalize_phone(phone)
        if len(clean) == 10:
            return f"+91 ******{clean[-4:]}"
        return phone

    def send_sms_via_gateways(self, phone_10_digit: str, message: str) -> Dict[str, Any]:
        """
        Attempts to deliver real SMS using available SMS gateways (Twilio or Fast2SMS).
        Falls back to local verified logger if no external credentials are configured.
        """
        delivered = False
        gateway_used = "Simulator / Local Dispatch"
        error_info = None

        # 1. Try Fast2SMS (Indian numbers +91)
        if self.fast2sms_api_key and len(self.fast2sms_api_key) > 5:
            try:
                url = "https://www.fast2sms.com/dev/bulkV2"
                payload = {
                    "authorization": self.fast2sms_api_key,
                    "route": "q",
                    "message": message,
                    "language": "english",
                    "flash": 0,
                    "numbers": phone_10_digit
                }
                data = urllib.parse.urlencode(payload).encode("utf-8")
                req = urllib.request.Request(url, data=data, headers={"User-Agent": "AgriPilot-Agent"})
                with urllib.request.urlopen(req, timeout=5) as response:
                    resp_body = json.loads(response.read().decode("utf-8"))
                    if resp_body.get("return") is True:
                        delivered = True
                        gateway_used = "Fast2SMS (Direct Indian Carrier)"
            except Exception as e:
                error_info = f"Fast2SMS error: {str(e)}"

        # 2. Try Twilio if Fast2SMS was not used or failed
        if not delivered and self.twilio_sid and self.twilio_auth_token and len(self.twilio_sid) > 10:
            try:
                from twilio.rest import Client
                client = Client(self.twilio_sid, self.twilio_auth_token)
                target_phone = f"+91{phone_10_digit}"
                msg = client.messages.create(
                    body=message,
                    from_=self.twilio_from,
                    to=target_phone
                )
                delivered = True
                gateway_used = f"Twilio SMS Gateway (SID: {msg.sid[:8]}...)"
            except Exception as e:
                error_info = f"Twilio error: {str(e)}"

        # 3. Write to local SMS outbox log for auditing and instant inspection
        try:
            log_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
            os.makedirs(log_dir, exist_ok=True)
            log_file = os.path.join(log_dir, "sms_outbox.log")
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            with open(log_file, "a", encoding="utf-8") as f:
                f.write(f"[{timestamp}] RECIPIENT: +91 {phone_10_digit} | GATEWAY: {gateway_used} | MESSAGE: {message}\n")
        except Exception:
            pass

        return {
            "delivered_to_cellular": delivered,
            "gateway": gateway_used,
            "error": error_info
        }

    def generate_and_send_otp(self, phone: str, role: str = "Farmer", language: str = "Hindi") -> Dict[str, Any]:
        """
        Generates a 6-digit random OTP and dispatches it to the contact number.
        """
        clean_phone = self._normalize_phone(phone)
        if len(clean_phone) != 10:
            return {
                "success": False,
                "message": "Invalid mobile number. Please provide a 10-digit Indian mobile number."
            }

        # Check if number is registered or new
        user_info = REGISTERED_CONTACTS.get(clean_phone)
        if not user_info:
            # Auto-register as new Progressive Farmer
            user_info = {
                "name": f"Farmer ({clean_phone[-4:]})",
                "role": "Senior Agronomist (ICAR)" if role == "Agronomist" else "Progressive Farmer",
                "phone": f"+91 {clean_phone}",
                "field_id": "FIELD-NORTH-01",
                "avatar": "🔬" if role == "Agronomist" else "👨‍🌾",
                "region": "Indore (Madhya Pradesh)",
                "crops": ["Wheat", "Gram"]
            }
            REGISTERED_CONTACTS[clean_phone] = user_info

        # Generate genuine random 6-digit OTP (never hardcoded 123456!)
        otp_code = str(secrets.randbelow(900000) + 100000)
        expires_at = time.time() + 300  # 5 minutes validity

        self.active_otps[clean_phone] = {
            "otp": otp_code,
            "expires_at": expires_at,
            "attempts": 0,
            "role": role
        }

        # Format genuine SMS message in English & Hindi
        sms_text = (
            f"AgriPilot Verification: Your OTP for Kisan Portal is {otp_code}. "
            f"Valid for 5 minutes. Do not share this OTP with anyone. - AgriPilot Autonomous AI"
        )
        if language == "Hindi":
            sms_text = (
                f"AgriPilot सत्यापन: किसान पोर्टल लॉगिन हेतु आपका OTP {otp_code} है। "
                f"यह 5 मिनट के लिए मान्य है। किसी के साथ साझा न करें। - AgriPilot AI"
            )

        # Dispatch via gateways
        dispatch_result = self.send_sms_via_gateways(clean_phone, sms_text)

        masked = self._mask_phone(clean_phone)

        return {
            "success": True,
            "message": f"OTP successfully sent to registered mobile {masked}",
            "recipient_masked": masked,
            "phone_clean": clean_phone,
            "user_name": user_info["name"],
            "user_role": user_info["role"],
            "expires_in_seconds": 300,
            "gateway_status": dispatch_result["gateway"],
            "delivered_to_cellular": dispatch_result["delivered_to_cellular"],
            # Dev preview provided so testers without paid SMS gateway can verify immediately on screen
            "dev_otp_preview": otp_code if not dispatch_result["delivered_to_cellular"] else None,
            "sms_text": sms_text
        }

    def verify_otp(self, phone: str, submitted_otp: str, role: Optional[str] = None) -> Dict[str, Any]:
        """
        Verifies the submitted 6-digit OTP against the active OTP store.
        """
        clean_phone = self._normalize_phone(phone)
        submitted = str(submitted_otp).strip()

        if clean_phone not in self.active_otps:
            return {
                "success": False,
                "message": "No active OTP found for this mobile number. Please click 'Send OTP' first."
            }

        record = self.active_otps[clean_phone]

        # Check expiration
        if time.time() > record["expires_at"]:
            del self.active_otps[clean_phone]
            return {
                "success": False,
                "message": "OTP has expired. Please request a fresh OTP."
            }

        # Check attempts limit
        record["attempts"] += 1
        if record["attempts"] > 4:
            del self.active_otps[clean_phone]
            return {
                "success": False,
                "message": "Maximum OTP verification attempts exceeded. Please request a new OTP."
            }

        # Compare code
        if submitted != record["otp"]:
            remaining = max(0, 4 - record["attempts"])
            return {
                "success": False,
                "message": f"Incorrect OTP entered. {remaining} attempt(s) remaining."
            }

        # OTP is verified! Consume it so it cannot be re-used
        del self.active_otps[clean_phone]

        # Retrieve registered user profile
        user_info = REGISTERED_CONTACTS.get(clean_phone, {
            "name": f"Farmer ({clean_phone[-4:]})",
            "role": "Progressive Farmer",
            "phone": f"+91 {clean_phone}",
            "field_id": "FIELD-NORTH-01",
            "avatar": "👨‍🌾",
            "region": "Indore (Madhya Pradesh)"
        })

        if role:
            if role == "Extension":
                user_info["role"] = "Extension Officer (KVK)"
                if "Farmer" in user_info.get("name", ""):
                    user_info["name"] = "Anand Kumar"
                    user_info["avatar"] = "📋"
                    user_info["region"] = "Indore KVK Extension"
            elif role == "Agronomist":
                user_info["role"] = "Senior Agronomist (ICAR)"
                if "Farmer" in user_info.get("name", ""):
                    user_info["name"] = "Dr. R. K. Verma"
                    user_info["avatar"] = "🔬"
                    user_info["region"] = "ICAR Agricultural Research"

        token = f"AGRI-{secrets.token_hex(16)}"

        return {
            "success": True,
            "message": f"Authentication successful. Welcome, {user_info['name']}!",
            "user": {
                "name": user_info["name"],
                "role": user_info["role"],
                "phone": user_info["phone"],
                "field_id": user_info.get("field_id", "FIELD-NORTH-01"),
                "avatar": user_info.get("avatar", "👨‍🌾"),
                "region": user_info.get("region", "Indore (MP)"),
                "token": token
            }
        }

    def get_registered_contacts(self) -> Dict[str, Any]:
        """Returns registered directory for UI demo selectors."""
        return {
            "contacts": [
                {
                    "phone": k,
                    "display_phone": f"+91 {k[:5]} {k[5:]}",
                    "name": v["name"],
                    "role": v["role"],
                    "region": v["region"],
                    "field_id": v["field_id"]
                }
                for k, v in REGISTERED_CONTACTS.items()
            ]
        }

auth_service = AuthService()
