# Patient Portal Security Boundary

**Status:** Technical foundation only. **Do not upload real protected health information until the practice completes legal, privacy, security, vendor, and operational approval.**

The HIPAA Security Rule requires regulated entities to protect the confidentiality, integrity, and availability of electronic protected health information through administrative, physical, and technical safeguards, including ongoing risk analysis and review of access activity.[1] HHS also states that a cloud provider that creates, receives, maintains, or transmits electronic protected health information is a business associate—even when it stores only encrypted data—and that the regulated entity and provider must enter an appropriate business associate agreement.[2]

Accordingly, this project can implement strong application-level controls, but code alone cannot establish HIPAA compliance. The practice must validate the hosting and storage vendors, obtain required business-associate agreements, conduct and document a risk analysis, establish workforce and incident-response procedures, approve retention and deletion rules, and confirm that production logging and support channels do not expose protected information.[1] [2]

| Boundary | Implemented in the website foundation | Required before real patient information |
|---|---|---|
| Identity | OAuth session with secure cookie handling | Practice-approved identity-proofing and account-recovery process |
| Authorization | Patient-only document access and clinician/admin-only upload controls | Formal role assignment, periodic access review, and immediate offboarding process |
| Storage | Randomized object keys, private metadata records, and short-lived authenticated download handoffs | Executed business-associate agreement and documented encryption, backup, recovery, retention, and deletion controls |
| Auditability | Application audit events for upload and download actions | Defined audit-review schedule, alerting, incident response, and retained evidence |
| Telehealth | External launch to the verified Doxy.me waiting room | Practice approval of its Doxy.me account, privacy configuration, consent workflow, and vendor agreement |
| Public website | No symptom, diagnosis, or medical-history collection | Approved privacy notice, accessibility review, and tracking/analytics review |

The supplied telehealth link resolves to **`https://doxy.me/v2/check-in/drmcalpine`** and displays “Dr. McAlpine's Check In Page | Doxy.me.” It asks the patient for a full name and provides a check-in action.[3] The practice website must label the service as **Doxy.me**, open it as an external destination, and avoid duplicating its waiting-room intake.

## References

[1]: https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html "HHS: Summary of the HIPAA Security Rule"
[2]: https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html "HHS: Guidance on HIPAA and Cloud Computing"
[3]: https://doxy.me/v2/check-in/drmcalpine "Dr. McAlpine's Check In Page | Doxy.me"
