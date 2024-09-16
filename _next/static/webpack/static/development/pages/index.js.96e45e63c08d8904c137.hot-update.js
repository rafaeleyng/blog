webpackHotUpdate("static/development/pages/index.js",{

/***/ "./posts/2024-09-16-self-hosting-a-bluesky-pds-and-using-you-domain-as-your-handle.md":
/*!********************************************************************************************!*\
  !*** ./posts/2024-09-16-self-hosting-a-bluesky-pds-and-using-you-domain-as-your-handle.md ***!
  \********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("---\ntitle: \"Self-hosting a Bluesky PDS and using you domain as your handle\"\ndate: 2024-09-16\nexcerpt: >\n  A complete guide to host your own PDS on Digital Ocean and use your domain name as your user handle.\n---\n\nFor simplicity, this post is opinionated and uses [Namecheap](https://www.namecheap.com/), [Digital Ocean](https://digitalocean.com/), and [Resend](https://resend.com/).\n\nCreate an account on each one. It should be straightforward to replace them with your preferred services, doing the necessary adjustments.\n\n## What we'll do\n\nIn this post, I will:\n* Buy the domain `bskydemo.xyz`. **NOTE: I'll use this domain name throughout the post, use yours instead**.\n* Run the Bluesky PDS (Personal Data Server) that will contain your own account data (including your posts) on a cloud platform. You can add other accounts if you want to, but it is out of scope here.\n* Point `pds.bskydemo.xyz` to the PDS instance.\n* Create an account on Bluesky using `pds.bskydemo.xyz` as the PDS.\n* Use the custom domain `bskydemo.xyz` as the user handle on Bluesky (`@bskydemo.xyz`).\n* Redirect `bskydemo.xyz` to the Bluesky profile (`https://bsky.app/profile/bskydemo.xyz`).\n\nYou can pick only the ones that you are interested in.\n\n## Buy a domain name\n\nGo to Namecheap and buy a domain name. We'll come back later to Namecheap to do DNS configurations.\n\nPick a cheap domain like `.xyz` or `.blog`, which cost around $2/year at the time of writing.\n\n## Create your PDS instance\n\nGo to Digital Ocean and create a project (just a wrapper to organize resources) called `bluesky-pds` and a create a new Droplet (what Digital Ocean calls their VMs).\n\nPick:\n* In \"Choose an image\" -> Marketplace -> search for \"BlueSky Social PDS\".\n  TODO\n* In \"Choose Size\", get one of the cheapest and smallest options. I picked 1 GB of RAM, 1 CPU, 25 GB of SSD. At the time of writing, it costs $6/month.\n  TODO\n* In \"Choose Authentication Method\", either configure access via SSH key or password. Later we'll need one of those to access the Droplet.\n  TODO\n\nCreate the Droplet, and once done, copy the IPv4 address of the Droplet. In my case, it is `167.172.254.26`. **NOTE: I'll use this IP throughout the post, use yours instead**\n  TODO\n\n## Configure your domain name's DNS\n\nBack to Namecheap, find your domain in \"Domain List\", click \"Manage\" -> \"Advanced DNS\".\n  TODO\nCreate these 3 records. Note the `Host` in the first line is an `@`, which means the root domain:\n  TODO\n\nTest that your DNS config is working by using https://dnschecker.org/#A/bskydemo.xyz. It should show the IP address you set. This might take a few minutes to propagate to all locations.\n  TODO\n\n## Initialize the PDS\n\nConnect to the Droplet using `ssh`:\n\n```shell\nssh root@bskydemo.xyz\n```\n\nIt will prompt you a few questions:\n* `Enter your public DNS address (e.g. example.com)`: enter `pds.bskydemo.xyz`.\n* `Enter an admin email address (e.g. you@example.com)`: enter your own email. At this point it will initialize the PDS, it will take a few seconds.\n* `Create a PDS user account? (y/N)`: press enter for `N`.\n\n## Configure a domain on Resend\n\nIn Resend, configure a domain. In my case, it is `bskydemo.xyz`.\n\nGo back to Namecheap and add a record like this:\n  TODO\n\n## Create an API key on Resend\n\nGo to Resend and create an API key. Copy that API key and store it somewhere safe, we'll need it soon. You can restrict it only to sending access and to the domain you configured above.\n\nThe free plan should be enough for your needs.\n\n## Configure SMTP on the PDS to be able to verify an account's email\n\nBack to the `ssh` session, run this (**NOTE: first edit the 2 values as needed, the first with your Resend API key, the second with your email - has to be on the domain configured on Resend**).\n\n```shell\necho 'PDS_EMAIL_SMTP_URL=smtps://resend:YOUR_API_KEY_HERE@smtp.resend.com:465/' >> /pds/pds.env\necho 'PDS_EMAIL_FROM_ADDRESS=admin@bskydemo.xyz' >> /pds/pds.env\nreboot\n```\n\nYou SSH session will close while the VM reboots. The PDS will restart with the new SMTP configuration.\n\nAccess the server again and run `pds create-invite-code`. It will output a code that you can use to create an account.\n\n## Create a Bluesky account\n\nGo to https://bsky.app/ (while being logged out), click \"Sign up\". Select \"Hosting provider\" -> \"Custom\", and enter `pds.bskydemo.xyz`\n\nEnter the information requested. The invite code is the one you got from `pds create-invite-code`. You can use your personal email, even if you already have a Bluesky account. You'll need to verify the email, so use an address that you can access.\n\nFor the handle, enter anything for now, like `temp`. Your user handle will be `temp.pds.bskydemo.xyz`. We'll change it later.\n\n## Verify your account's email\n\nGo to https://bsky.app/settings, click \"Verify My Email\". You'll get an email with a code to input in the next step.\n\nTip: if you get an error here, check the network tab on the browser. The error is most likely happening on your PDS, and the full error will be there. You can access it with `docker logs -f pds` while you do the email verification process.\n\n## Configure the domain name as your handle\n\nGo to https://bsky.app/settings, click \"Change Handle\" -> \"I have my own domain\". Enter `bskydemo.xyz` as the handle you want to use.\n\nGo to Namecheap and add this record (**NOTE: copy the DID value from the Bluesky settings page**, don't use the same as mine):\n  TODO\n\nCheck in https://dnschecker.org/#TXT/_atproto.bskydemo.xyz that your record is correctly configured (it should return the same DID value as in the Bluesky settings page):\n  TODO\n\nBack to the settings page, click \"Verify DNS Record\" and click to update your handle to `@bskydemo.xyz`.\n\nIf you have any issues doing this through the UI, try doing it through the API directly. From https://aaronparecki.com/2023/03/07/3/bluesky-custom-domain:\n\n```sh\nhttp post https://pds.bskydemo.xyz/xrpc/com.atproto.server.createSession identifier=YOUR_EMAIL password=YOUR_PASSWORD\n# Use the value of \"accessJwt\" below\nhttp post https://pds.bskydemo.xyz/xrpc/com.atproto.identity.updateHandle Authorization:\"Bearer ACCESS_JWT_RETURNED ABOVE\" handle=bskydemo.xyz\n```\n\n## Point your domain to your Bluesky profile\n\nIf you want to make https://bskydemo.xyz redirect to https://bsky.app/profile/bskydemo.xyz, you need to configure it on the Caddy server running alongside the PDS.\n\nConnect to your Droplet again and run:\n\n```shell\ncat <<EOF >> /pds/caddy/etc/caddy/Caddyfile\n\nbskydemo.xyz {\n        redir https://bsky.app/profile/bskydemo.xyz\n}\n\nEOF\n\nreboot\n```\n\nOnce the reboot is done (and Caddy is running, so give it a minute), access https://bskydemo.xyz. It should redirect to the Bluesky profile.\n\n## Conclusion\n\nYou now have a Bluesky PDS running on Digital Ocean, using your domain name as your user handle. You can post and interact with other Bluesky users.\n\nNote how, even though `pds.bskydemo.xyz` and `bskydemo.xyz` resolve to the same IP address, they are used for different purposes. We want `https://bskydemo.xyz` to redirect to the profile, as it is the most user-friendly URL. So we need a different URL to access the PDS, hence `pds.bskydemo.xyz`, which won't redirect.\n");

/***/ })

})
//# sourceMappingURL=index.js.96e45e63c08d8904c137.hot-update.js.map