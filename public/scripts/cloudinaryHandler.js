
function uploadPoster() {
    document.getElementById("poster_upload_widget_opener").addEventListener("click", function() {
        cloudinary.openUploadWidget({
                multiple: false,
                cloud_name: 'ruslan-kickclone',
                upload_preset: 'v8cwbvgj',
                client_allowed_formats: ['png','gif', 'jpeg']
            },
            function(error, result) {
                let img = {secure_url: result[0].secure_url, public_id:  result[0].public_id};
                document.getElementById("posterCloud").setAttribute("value", JSON.stringify(img));
            });
    }, false);

}

function uploadMore() {
    document.getElementById("moreImages_upload_widget_opener").addEventListener("click", function () {
        cloudinary.openUploadWidget({
                multiple: true,
                cloud_name: 'ruslan-kickclone',
                upload_preset: 'v8cwbvgj',
                client_allowed_formats: ['png', 'gif', 'jpeg']
            },
            function (error, result) {

                result.forEach(function (pic) {
                    console.log(pic);
                    images.push({secure_url: pic.secure_url, public_id: pic.public_id});
                });
                document.getElementById("moreImages").setAttribute("value", JSON.stringify(images));
            });
    }, false);
}

function remove(){
    images.forEach(function(img,index){document.getElementById("imgClickAndChange_"+index).addEventListener("click", function() {
        document.getElementById("imgClickAndChange_"+index).setAttribute("src", 'https://www.freepngimg.com/download/trash_can/4-2-trash-can-picture.png');
        imagesToDel.push({secure_url: img.secure_url, public_id: img.public_id});
        document.getElementById("toRemove").setAttribute("value", JSON.stringify(imagesToDel));
    })
    });
}

