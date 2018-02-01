# Salon 94 Design Administration

salon94design.com uses [Netlify](https://www.netlify.com/) for hosting the site
and [Netlify CMS](https://www.netlifycms.org/) for editing site content. Site
data and user accounts are managed on [GitHub](https://www.github.com).

## Creating a GitHub account

You will need a GitHub account to:

* Log in to the CMS
* Add additional CMS users

To create a GitHub account:

1. Navigate to [github.com](https://github.com/).
2. Complete the signup form on the home page.
3. Verify the email you used to sign up.
4. Login to GitHub at [github.com](https://github.com/login).

## Joining the GitHub repository

In order to log in to the CMS, you must be a collaborator on the
[Salon 94 GitHub repository](https://github.com/computer-lab/salon94design.com).
An existing collaborator must invite you to the GitHub repository using the
procedure in the following section.

## Adding a user to the GitHub repository

To add a new collaborator:

1. Log on to GitHub as a user with access to the GitHub repository - currently,
   Ryan has this capability with his **ryansalon94design** account.
2. Navigate to the [collaboration page](https://github.com/computer-lab/salon94design.com/settings/collaboration).
3. Scroll down to the **Collaborators** section.
4. Search for the username, full name or email address of the collaborator you
   want to add. Note that they must have first created a GitHub account as
   described above.
5. GitHub will send a confirmation email. Once the user confirms their intention
   to collaborate by clicking the confirmation link they will be able to edit
   content in the CMS.
6. In the permission level dropdown select:
    * **Admin** if you want the user to be able to add additional collaborators
      and edit the CMS.
    * **Write** if you want the user to be able to edit the CMS but **not** add
      additional collaborators.

## Logging in to the CMS

Netlify CMS runs in your browser, so it is not necessary to log on to another
site to use it. You can access the CMS on the salon94design.com site by
navigating to the [admin page](https://salon94design.com/admin/).

The page will prompt you to click a button that says `Log in with GitHub`. By
clicking this button, a window will pop-up where you can log in to GitHub and
confirm that the CMS can use your account to access site data.

Once you have successfully logged in, you will be redirected to the CMS.

## Using the CMS

**XXX This section will change slightly if we opt to use the latest UI**

After logging in the CMS interface will be displayed. On the left is a sidebar
listing each type of editable object:

**Designer** A designer that is displayed in a list at `/designers/` and in
             detail at `/designers/{slug}/`. A designer also has **Works** that
             are displayed in the lists at `/works/{category}/{subcategory}/`.

**Project**  A *fair* or *exhibition* that is displayed in the list at `/fairs/`
             or `/exhibitions/` and in detail at `/fairs/{slug}/` and
             `/exhibitions/{slug}/` respectively.

**Info**     A singleton object representing the page at `/info/`. Includes
             contact info, mailing list, press and other generic info.

**Landing Page** A singleton object that controls the splash image and homepage
                 content.

### Creating or editing an object

To create a new **Designer** or **Project**, click on the *plus* icon next to
the target collection. New **Info** and **Landing Page** objects cannot be
created. You can also use the *plus* button on the top menu bar.

To edit an object, click the target collection. You will see a grid of editable
objects. By clicking on a particular object in the grid you will be presented
with an interface where you can make changes to that object.

### Deleting an object

To delete an object, first click on the target collection and object to arrive
at the editor interface. Then click the *Delete* button on the bottom menu bar
and confirm your intention to delete the object.

### Using the editor interface

The editor interface consists of two columns. The column on the left contains
editable fields for each aspect of the object. The column on the right displays
a rough preview of the changes you have made in the left column. Please note
that this column is only an approximation of how the object will appear in
different contexts on the live site.

To make changes to an object, edit the content in the fields on the left
column. When you are satisfied with your changes, click the *Save* button on
the bottom menu bar and confirm your intention to save the object.

### Finding a particular object

For a collection with many objects (e.g: **Designer**) it may be easier to
search for the object you want to edit instead of finding it in the collection
grid. In this case you can use the search bar in the top menu bar. The search
bar is case-insensitive and will return any matching object in a grid.

### Adding images

**XXX may be subject to change**

Uploaded images should have either a 4:3 or 3:4 aspect ratio with the work
centered in the image. Wide images are preferred - tall images may be cut off
depending on their height. Images should be no bigger than 1MB. Any image format
is supported, however, ultimately the images will be converted to JPEGs.

### Verifying your changes

Once you click the *Save* button on a new object, the following process takes
place:

* The object is updated on GitHub
* Any added images are pre-processed to multiple sizes
* The entire site is re-deployed to Netlify

This process can take anywhere from 1-5 minutes. In the meantime the old version
of the site will still be displayed. You can track the progress of the site
deployment in the Netlify console.

## Logging in to the Netlify console

You can use your GitHub account to login to the netlify console. Your GitHub
user must be listed in the [site administrators](https://app.netlify.com/sites/tank-commander-melody-70755/settings/general#site-administrators)
section of the console in order to log in. Visit the [login page](https://app.netlify.com/)
and log in with GitHub.

## Using the Netlify console

You can use the Netlify console to track the status of a deployment following
your edits or manage DNS for salon94design.com.

### Tracking the status of a deployment

On the left-hand side of the [overview page](https://app.netlify.com/sites/tank-commander-melody-70755/overview)
you will see a section called **Production deploys**. Any deploys resulting from
your site changes will be displayed here. Your deploy can be in one of the
following states:

**Published** The deploy is complete

**Building**  The deploy is in progress

**Failed**    The deploy has failed

Once the deploy is in a **Published** state you will be able to see your changes
reflected on `www.salon94design.com`.

### Managing DNS

Netlify requires the use of its own nameservers for certain features to work
(e.g: custom domain, free SSL certificate). This means that any DNS changes
for salon94design.com such as adding a subdomain or changing email providers
will take place in the Netlify console.

To make DNS changes, navigate to the [Domain Management](https://app.netlify.com/sites/tank-commander-melody-70755/settings/domain)
section of the Netlify settings. There you will be able to manage DNS records
for the bare domain `salon94design.com` and the primary domain
`www.salon94design.com`.
