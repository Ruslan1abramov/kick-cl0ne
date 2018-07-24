# kick-cl0ne
This project was made as a part of a school project in web programing
The project was made using node.js
Installation notes:
    1. make sure that you have mongodb client on your machine
    2. for password encryption i used bcrypt , in order to install you need first to install glob
        npm install glob -g --save
    3. installing the dependencies npm install
    4. i will provide you a file with my environmental variables (port number, admin password)
npm libraries:
    1. express      - used it control the routes and to render the client with information
    2. ejs          - Embedded JavaScript templates i used it to create the views and easily combining html and js
    3. mongoose     - used it to mange my date base
    4. passport     - this library allows us to easily mange our user authentication,
                        therefore it was used for user authentication
    5. body-parser  - was used to parse the incoming html massages when posting or putting
    6. connect-flash- was used to show user alerts
    7. dotenv       - was used to red my environmental variables
    8. bcrypt       - was used for password encryption
    9. cloudinary   - this amazing third party cloud platform allows easy image management i used it on server side
                      just for deleting images, it's main used was uploading pictures using their widget from the client side
css: most of my project was made with bootstrap, i also used a bit of google fonts and some background gradients i found online

in order to build this site i used 3 major online guides:
    the main one is a udemy course called "the web developer bootcamp",
    other than that i used http://davismj.me/blog/bcrypt/ ,
    W3 school , stackoverflow, and a few youtube class

As for now the web works fine but i have'nt tested it on large scale so it is hard for me to say how it will behave,
my guess is that it will have some hard times dealing with many users as i'm still a NEWBIE to this.
Some known bugs:
    1. each time you press the upload poster image link it overrides the poster you had before
    2. in order for the client to show the video link it must be an embedded link
    3. it's not a bug per se but in order for me to manage the projects i made a demon that runs every 10 minutes to
        check whether the project dead line is over, so an expired project can be shown for 10 minutes before it gets handheld
