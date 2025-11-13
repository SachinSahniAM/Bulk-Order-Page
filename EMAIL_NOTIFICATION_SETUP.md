# Email Notification Setup

## ✅ Email Notification Feature Added

When a customer submits the bulk order form, an automatic email notification is now sent to **info@almamaterstore.in** with all the lead details.

---

## 📧 What Gets Sent

**Email includes:**
- Customer name
- Email address
- Phone number
- Company name (if provided)
- Product type
- Quantity
- Printing type
- Estimated price
- Custom message
- Lead ID (for tracking)
- Submission timestamp

---

## 🎨 Email Format

The email is sent in **professional HTML format** with:
- ✅ Branded header with gradient
- ✅ Organized sections
- ✅ Highlighted order details
- ✅ Easy-to-read layout
- ✅ Lead ID for reference
- ✅ Professional footer

**Subject Line:**
```
New Bulk Order Lead: [Customer Name] - [Quantity] units
```

---

## 🔧 Technical Implementation

**Backend Changes Made:**
1. Added email libraries (smtplib, email.mime)
2. Created `send_email_notification()` function
3. Updated `/api/bulk-order-lead` endpoint to send emails
4. Email sending is non-blocking (won't fail form submission if email fails)

**Email Configuration:**
- Recipient: info@almamaterstore.in
- Sender: noreply@almamaterstore.in
- SMTP: localhost:25 (using system sendmail)

---

## ⚙️ Email Server Requirements

For emails to be delivered successfully, you need:

### Option 1: System Sendmail (Already Configured)
The app uses localhost SMTP which works if sendmail is installed on the server.

### Option 2: Gmail SMTP (For Production)
If you want to use Gmail to send emails:

1. **Update backend code to use Gmail SMTP:**
```python
# In send_email_notification function, replace:
with smtplib.SMTP('localhost', 25) as server:
    server.send_message(msg)

# With:
with smtplib.SMTP('smtp.gmail.com', 587) as server:
    server.starttls()
    server.login('your-gmail@gmail.com', 'your-app-password')
    server.send_message(msg)
```

2. **Add credentials to .env file:**
```
SMTP_EMAIL=your-gmail@gmail.com
SMTP_PASSWORD=your-app-password
```

3. **Enable App Password in Gmail:**
   - Go to Google Account settings
   - Security → 2-Step Verification
   - App passwords → Generate new password
   - Use this password in SMTP_PASSWORD

### Option 3: SendGrid (Recommended for Production)
For reliable email delivery at scale:

1. **Install SendGrid:**
```bash
pip install sendgrid
```

2. **Get SendGrid API Key:**
   - Sign up at sendgrid.com
   - Create API key
   - Add to .env: `SENDGRID_API_KEY=your-key`

3. **Update code to use SendGrid API**

### Option 4: AWS SES
For high-volume email sending:
- Sign up for AWS SES
- Verify your domain
- Use boto3 library
- Very cost-effective

---

## 🧪 Testing

**Test if emails are working:**

1. **Submit test lead through form**
2. **Check backend logs:**
```bash
tail -f /var/log/supervisor/backend.err.log | grep Email
```

3. **Look for:**
```
Email notification sent to info@almamaterstore.in for lead [lead-id]
```

**If emails aren't sending:**
- Check if sendmail is installed: `which sendmail`
- Check logs for error messages
- Consider switching to Gmail SMTP or SendGrid

---

## 📊 What Happens When Form is Submitted

**Step 1:** Customer fills form and clicks "Submit Request"

**Step 2:** Frontend sends data to `/api/bulk-order-lead`

**Step 3:** Backend:
- ✅ Saves lead to MongoDB
- ✅ Logs to console
- ✅ Sends email to info@almamaterstore.in
- ✅ Returns success to frontend

**Step 4:** Customer sees success message

**Step 5:** You receive email at info@almamaterstore.in

---

## 📧 Sample Email Content

```
Subject: New Bulk Order Lead: John Doe - 100 units

[Gradient Header: New Bulk Order Lead Received!]

Name: John Doe
Email: john@company.com
Phone: +91 76191 68045
Company: ABC Corporation

[Highlighted Section]
Product Type: round-neck-tshirt
Quantity: 100 pieces
Printing Type: screen
Estimated Price: ₹37,425 - ₹39,296

Message:
Need custom logo printed on front and company name on back.
Event date: December 15, 2025

Lead ID: 60f46e90-1b14-4615-a218-09df05ed8d02
Submitted: 2025-11-13 13:48:05 UTC

[Footer]
Alma Mater Store - Bulk Order System
This is an automated notification. Please respond within 24 hours.
```

---

## 🎯 Next Steps for Production

1. **Choose Email Provider:**
   - Gmail SMTP (simple, free for low volume)
   - SendGrid (reliable, scalable)
   - AWS SES (enterprise, cost-effective)

2. **Update SMTP Settings:**
   - Add credentials to .env
   - Update send_email_notification() function
   - Test email delivery

3. **Optional Enhancements:**
   - Add email to customer (confirmation)
   - CC multiple team members
   - Add attachments (mockups, quotes)
   - Track email opens
   - Auto-follow-up emails

4. **Email List Management:**
   - Create email alias: bulkorders@almamaterstore.in
   - Forward to team members
   - Set up email filters/labels
   - Use CRM integration

---

## 🔒 Security Notes

**Email Credentials:**
- Never commit SMTP passwords to git
- Use environment variables
- Use app passwords, not main password
- Rotate passwords regularly

**Spam Prevention:**
- Verify sender domain (SPF, DKIM)
- Use authenticated SMTP
- Don't send too many emails per minute
- Include unsubscribe option (if sending to customer)

---

## 📞 Support

**If emails aren't working:**
1. Check backend logs for errors
2. Verify SMTP server is accessible
3. Test with curl/telnet to SMTP server
4. Check spam folder
5. Verify email address is correct

**For help setting up production email:**
- Contact your hosting provider
- Use SendGrid free tier (100 emails/day)
- Or switch to Gmail SMTP (simple setup)

---

## ✅ Current Status

**Implemented:**
- ✅ Email sending on form submission
- ✅ HTML formatted emails
- ✅ All lead details included
- ✅ Non-blocking (won't fail form if email fails)
- ✅ Logging for debugging

**Ready for:**
- Production use with proper SMTP configuration
- Scaling to handle many leads
- Integration with CRM systems

---

**Emails are configured to go to: info@almamaterstore.in**

Update SMTP settings for production environment to ensure reliable delivery!
