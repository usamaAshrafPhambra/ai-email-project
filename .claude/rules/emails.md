---
paths:
  - "campaigns/**/emails/*.md"
---

# Rules for every campaign email

Every email file must follow these rules.

## Top of the email

- The first line is `Subject: ...`. The subject is 50 characters or fewer.
- The second line is `Preview: ...`. The preview is 90 characters or fewer.

## Greeting

- Greet the reader politely as `Dear {{first_name}},`.

## Body

- Use bold only for short headings, such as tip titles or questions. Don't bold brand phrases like "carefully chosen".
- If the email asks the reader to ask us or tell us something, say how: "reply to this email" (and the shop, if it fits). Don't add a second link for this.

## Link

- Have exactly one main link, written like this:
  `[See the new arrivals](https://usamafabric.example/new-arrivals)`
- The button text can change to suit the email, but there is only one main link.
- The button text must match the page it opens. Don't promise a special page (like "our favourites") if the link goes to the general new-arrivals page.

## End of the email

- End with our sign-off from `brand/voice.md`:

  Thank you for your trust,
  Team Usama Fabric

- After the sign-off, add this two-line footer as plain text. Do not put it inside a code block.

  You're getting this because you asked to hear when new stock arrives at Usama Fabric.
  Usama Fabric, {{company_address}} · Unsubscribe: {{unsubscribe_url}}
