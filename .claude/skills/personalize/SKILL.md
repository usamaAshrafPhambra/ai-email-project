---
name: personalize
description: Write a version of each campaign email for every lead group in leads/leads.csv. Use when a campaign's emails are final and you want one copy per group.
argument-hint: "[campaign folder]"
context: fork
allowed-tools: Read, Glob, Grep, Write
---

# Personalize a campaign for each lead group

Campaign folder: $ARGUMENTS

## 1. Check the campaign folder

If no campaign folder is given, stop. Use Glob to list the folders in `campaigns/` and reply with that list. Don't write any files.

If a folder is given but it has no `emails/` folder, stop and say so.

## 2. Find the lead groups

Read `leads/leads.csv`. The groups are in the `group` column. Today they are:

- home-tailoring
- gift-and-wedding
- loyal-repeat

Use the groups you find in the file, so a new group is picked up too.

## 3. Write one version per email, per group

Use Glob to find every email in `<campaign folder>/emails/`. For each email and each group:

- Keep these exactly the same: the structure, the subject, the link and the footer.
- Change only two things so the email fits that group:
  - the opening line
  - one example
- Save it to `<campaign folder>/groups/<group>/emails/` with the same file name as the original.

## 4. Reply with a short summary only

When you finish, reply with:

- how many files you wrote
- one example opening line per group

Nothing else.
