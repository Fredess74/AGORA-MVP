# Privacy Policy

**Agora AI Agent Marketplace**  
*Last updated: April 15, 2026*

---

## 1. Introduction

Agora ("we", "us", "our") operates the Agora AI Agent Marketplace platform, including the Agora Custom GPT assistant available through OpenAI's ChatGPT. This Privacy Policy explains how we collect, use, and protect your information when you interact with our services.

**Contact:** agora@suffolk.edu  
**Website:** https://github.com/Fredess74/AGORA-MVP

---

## 2. Information We Collect

### 2.1 Information You Provide
- **Search Queries:** When you use the Agora Custom GPT, your search queries are sent to our Supabase database to find matching AI agents and tools.
- **Account Information:** If you create an account on the Agora marketplace, we collect your email address, username, and GitHub profile information (via OAuth).

### 2.2 Information Collected Automatically
- **Usage Logs:** We log API calls to the marketplace (listing searched, timestamp, response latency) for trust score computation.
- **No Personal Tracking:** We do not use cookies, tracking pixels, or advertising trackers on our platform.

### 2.3 Information We Do NOT Collect
- We do **not** store your ChatGPT conversation history.
- We do **not** collect your IP address through the Custom GPT.
- We do **not** sell, rent, or share your personal data with third parties.
- We do **not** use your data to train AI models.

---

## 3. How We Use Your Information

| Data | Purpose | Retention |
|------|---------|-----------|
| Search queries | Match you with relevant AI agents from our catalog | Not stored permanently |
| Account email | Authentication, notifications | Until account deletion |
| API usage logs | Trust score computation (EWMA algorithm) | 90 days rolling |
| GitHub OAuth data | Identity verification for creators | Until account deletion |

---

## 4. Data Storage & Security

- **Database:** All data is stored on [Supabase](https://supabase.com/) (hosted on AWS infrastructure) with encryption at rest and in transit (TLS 1.3).
- **Authentication:** We use Supabase Auth with GitHub OAuth. We never store raw passwords.
- **Access Control:** Row Level Security (RLS) policies restrict data access to authorized users only.

---

## 5. Third-Party Services

We use the following third-party services:

| Service | Purpose | Their Privacy Policy |
|---------|---------|---------------------|
| Supabase | Database & Authentication | [supabase.com/privacy](https://supabase.com/privacy) |
| OpenAI (ChatGPT) | Custom GPT hosting | [openai.com/privacy](https://openai.com/privacy) |
| GitHub | OAuth & code hosting | [github.com/privacy](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) |

---

## 6. ChatGPT Custom GPT — Specific Disclosures

When you use the Agora assistant through ChatGPT:

1. **Your messages** are processed by OpenAI according to [OpenAI's usage policies](https://openai.com/policies/usage-policies).
2. **Search queries** are sent to our Supabase PostgREST API to retrieve matching AI agent listings.
3. **No personal data** is transmitted beyond the search keyword itself.
4. **Results returned** contain only publicly available marketplace listing data (agent name, trust score, pricing, description).
5. We have **no access** to your OpenAI account, conversation history, or personal information.

---

## 7. Your Rights

You have the right to:

- **Access** your personal data we hold
- **Delete** your account and all associated data
- **Export** your data in a machine-readable format
- **Opt out** of any non-essential data collection

To exercise these rights, contact us at **agora@suffolk.edu**.

---

## 8. Children's Privacy

Our services are not directed at children under 13. We do not knowingly collect personal information from children.

---

## 9. Changes to This Policy

We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of our services after changes constitutes acceptance of the updated policy.

---

## 10. Contact Us

If you have any questions about this Privacy Policy:

- **Email:** agora@suffolk.edu
- **GitHub:** [github.com/Fredess74/AGORA-MVP](https://github.com/Fredess74/AGORA-MVP)
- **Organization:** Suffolk University, Boston, MA

---

*This privacy policy is hosted at:*  
`https://github.com/Fredess74/AGORA-MVP/blob/main/PRIVACY_POLICY.md`
