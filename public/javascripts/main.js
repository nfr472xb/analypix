window.onload = () => {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCJ_nEd_LHWI9YtGI-4V5SPdXHj9K5g0rY",
        authDomain: "analypix.firebaseapp.com",
        databaseURL: "https://analypix.firebaseio.com",
        projectId: "analypix",
        storageBucket: "analypix.appspot.com",
        messagingSenderId: "896284143312"
    };
    firebase.initializeApp(config);


    var textEmail = document.getElementById('textEmail');
    var textPassword = document.getElementById('textPassword');
    var btnSignUp = document.getElementById('btnSignUp');
    var btnLogin = document.getElementById('btnLogin');
    var btnLogout = document.getElementById('btnLogout');
    var addButton = document.getElementById('addButton');
    var userName = document.getElementById('userName');
    var user;

    const LOADING_PICTURE = `<img src='https://loading.io/spinners/pinkpig/index.pink-pig-ajax-loader.gif' />`;

    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            user = firebaseUser;
            userName.textContent = firebaseUser.email;
            userName.setAttribute('href', '/users/' + firebaseUser.uid);
        } else {
            console.log('尚未登入');
        }
    })

    function login(email, password) {
        firebase.auth().signInWithEmailAndPassword(email, password).catch(e => alert(e));
        setTimeout(() => {  
            window.location = '/';
            session.setAttribute("loginuser",email);
        }, 2000)

    }

    function register(email, password) {
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(e => alert(e.message));
    }

    function backToPreviousPage() {
        window.history.back();
    }

    if (btnLogin) {
        btnLogin.addEventListener('click', e => {
            let email = textEmail.value;
            let password = textPassword.value;
            login(email, password);
            
        })
    }

    if (btnSignUp) {
        btnSignUp.addEventListener('click', e => {
            let email = textEmail.value;
            let password = textPassword.value;
            register(email, password);
            setTimeout(() => {
                login(email, password);
            }, 500);
            var loginsession = email;
        })
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', e => {
            firebase.auth().signOut();
            window.location.reload();
        })
    }

    // index START
    var cardContainer = document.getElementById('card-container');

    if (cardContainer) {
        var postRef = firebase.database().ref('/post');

        postRef.once('value', snapshot => {
            var allcard = '';
            snapshot.forEach(data => {
                var card = `<div class="col s12 m6 l4">
                                <div class="card hoverable fadeIn animated fadeIn">
                                    <a href="/post/${data.val().postid}" class="card-image center">
                                        <img id="postPhoto" src="${data.val().photo}">
                                    </a>
                                <div class="card-content">
                      <span id="postAuthor">
                      <a href="/users/${data.val().author}">
                        <i class="material-icons">face</i>${data.val().email}
                      </a>
                      </span><br />
                      <span id="postLocation">
                        <a href="/location/${data.val().location}">
                            <i class="material-icons">location_on</i>${data.val().location}
                        </a>
                      </span><br>
                      <ul id="postTag" class="tags">
                      <li><a href="/tag/${data.val().tag[0].name}">${data.val().tag[0].name}</a></li>
                      <li><a href="/tag/${data.val().tag[1].name}">${data.val().tag[1].name}</a></li>
                      </ul>
                  </div>
                </div>
              </div>`;
                allcard += card;
            })
            cardContainer.innerHTML = allcard;
        })
    }
    // index END

    // fileUpload START
    var file;

    var fileInput = document.getElementById('fileInput');
    var btnUpload = document.getElementById('btnUpload');
    var uploadContainer = document.getElementById('upload-container');
    var autocomplete = document.getElementById('autocomplete');


    if (fileInput) {
        fileInput.addEventListener('change', event => {
            file = event.target.files[0];
        }, false)
    }

    if (btnUpload) {
        btnUpload.addEventListener('click', e => {
            if (!user) {
                alert('請先登入!');
                window.location.replace('/login');
                return;
            }
            if (!file) {
                alert('請上傳圖片檔');
                return;
            }
            if (!autocomplete.value) {
                alert('請選擇地區');
                return;
            }
            var loading = document.createElement('img');
            loading.src = 'https://loading.io/spinners/bluecat/lg.blue-longcat-spinner.gif';
            btnUpload.style.display = 'none';
            uploadContainer.append(loading);

            var postRef = firebase.database().ref('/post');
            var photoRef = firebase.storage().ref('/' + user.uid + '/' + file.name);
            photoRef.put(file, { 'contentType': file.type }).then(snapshot => {
                var post = {};
                // vision api
                var tag = [];
                var subscriptionKey = "ad1ec4557f20403c803828b37f791a2d";
                var uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze";
                var params = {
                    "visualFeatures": "Tags",
                    "details": "",
                    "language": "en",
                };

                $.ajax({
                    url: uriBase + "?" + $.param(params),
                    // Request headers.
                    beforeSend: function (xhrObj) {
                        xhrObj.setRequestHeader("Content-Type", "application/json");
                        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
                    },
                    type: "POST",
                    // Request body.
                    data: '{"url": ' + '"' + snapshot.downloadURL + '"}',
                })
                    .done(function (data) {
                        // Show formatted JSON on webpage.
                        $("#responseTextArea").val(JSON.stringify(data, null, 2));

                        var newPostKey = postRef.push().key;
                        post = {
                            'postid': newPostKey,
                            'email': user.email,
                            'author': user.uid,
                            'photo': snapshot.downloadURL,
                            'location': autocomplete.value,
                            'tag': data.tags
                        }

                        var updates = {};
                        updates['/post/' + newPostKey] = post;
                        updates['/user-post/' + user.uid + '/' + newPostKey] = post;

                        firebase.database().ref().update(updates);
                        setTimeout(() => {
                            alert('上傳成功');
                            window.history.back();
                        }, 500);
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        // Display error message.
                        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
                        errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
                        alert(errorString);
                    });
            })
        })
    }
    // fileUpload END

    // location relate post START
    var locationCardContainer = document.getElementById('location-card-container');

    if (locationCardContainer) {
        var postRef = firebase.database().ref('/post');
        var pathid = location.pathname.substring(10, location.pathname.length);
        var count = 0;
        postRef.once('value', snapshot => {
            var allcard = '';
            snapshot.forEach(data => {
                if (pathid === data.val().location) {
                    count++;
                    var card = `<div class="col s12 m6 l4">
                <div class="card hoverable fadeIn animated fadeIn">
                    <a href="/post/${data.val().postid}" class="card-image center">
                        <img id="postPhoto" src="${data.val().photo}">
                    </a>
                <div class="card-content">
      <span id="postAuthor">
      <a href="/users/${data.val().author}">
        <i class="material-icons">face</i>${data.val().email}
      </a>
      </span><br />
      <span id="postLocation">
        <a href="/location/${data.val().location}">
            <i class="material-icons">location_on</i>${data.val().location}
        </a>
      </span><br>
      <ul id="postTag" class="tags">
      <li><a href="/tag/${data.val().tag[0].name}">${data.val().tag[0].name}</a></li>
      <li><a href="/tag/${data.val().tag[1].name}">${data.val().tag[1].name}</a></li>
      </ul>
  </div>
</div>
</div>`;
                    allcard += card;
                }
            })
            locationCardContainer.innerHTML = allcard;
            var title = document.createElement('h2');
            title.textContent = `${pathid}(${count})`;
            title.className = "center light-blue-text text-darken-1 tags";
            locationCardContainer.parentElement.append(title);
            locationCardContainer.innerHTML = allcard;
        })
    }
    // location relate post END

    // user START
    var userCardContainer = document.getElementById('user-card-container');

    if (userCardContainer) {
        var postRef = firebase.database().ref('/post');
        var pathid = location.pathname.substring(7, location.pathname.length);
        postRef.once('value', snapshot => {
            var allcard = '';
            snapshot.forEach(data => {
                if (pathid === data.val().author) {
                    var card = `<div class="col s12 m6 l4">
                    <div class="card hoverable fadeIn animated fadeIn">
                        <a href="/post/${data.val().postid}" class="card-image center">
                            <img id="postPhoto" src="${data.val().photo}">
                        </a>
                    <div class="card-content">
          <span id="postAuthor">
          <a href="/users/${data.val().author}">
            <i class="material-icons">face</i>${data.val().email}
          </a>
          </span><br />
          <span id="postLocation">
            <a href="/location/${data.val().location}">
                <i class="material-icons">location_on</i>${data.val().location}
            </a>
          </span><br>
          <ul id="postTag" class="tags">
          <li><a href="/tag/${data.val().tag[0].name}">${data.val().tag[0].name}</a></li>
          <li><a href="/tag/${data.val().tag[1].name}">${data.val().tag[1].name}</a></li>
          </ul>
      </div>
    </div>
  </div>`;
                    allcard += card;
                }
            })
            userCardContainer.innerHTML = allcard;
        })
    }
    // user END


    // single post START
    var singleCardContainer = document.getElementById('single-card-container');

    if (singleCardContainer) {
        var postRef = firebase.database().ref('/post');
        var pathid = location.pathname.substring(6, location.pathname.length);

        postRef.once('value', snapshot => {
            var allcard = '';
            snapshot.forEach(data => {
                if (pathid === data.val().postid) {
                    var card = `<div class="col s12 m6 l4">
                    <div class="card hoverable animated fadeIn" id="singleCard">
                        <a href="/post/${data.val().postid}" class="card-image center">
                            <img id="postPhoto" src="${data.val().photo}">
                        </a>
                    <div class="card-content">
          <span id="postAuthor">
          <a href="/users/${data.val().author}">
            <i class="material-icons">face</i>${data.val().email}
          </a>
          </span><br />
          <span id="postLocation">
            <a href="/location/${data.val().location}">
                <i class="material-icons">location_on</i>${data.val().location}
            </a>
          </span><br>
          <ul id="postTag" class="tags">
          <li><a href="/tag/${data.val().tag[0].name}">${data.val().tag[0].name}</a></li>
          <li><a href="/tag/${data.val().tag[1].name}">${data.val().tag[1].name}</a></li>
          </ul>
          <div class="card-action">
          <div class="input-field row">
          <label for='comment'>留言</label>
          <input type="text" id="comment" class="col m10"/>
          <button id="btnSendComment" class="btn waves-effect col m2">send</button>
        </div>
        <ul id="postMsg"><img src='https://loading.io/spinners/pinkpig/index.pink-pig-ajax-loader.gif' /></ul>
        </div>
    
      </div>
    </div>
  </div>`;
                    allcard += card;
                }
            })
            singleCardContainer.innerHTML = allcard;

            var comment = document.getElementById('comment');
            var btnSendComment = document.getElementById('btnSendComment');
            var postMsg = document.getElementById('postMsg')
            function sendComment() {
                var newKey = postRef.push().key;
                post = {
                    name: user.email,
                    msg: comment.value
                };
                var updates = {};
                updates['/post/' + pathid + '/comment/' + newKey + '/'] = post;
                updates['/user-post/' + user.uid + '/' + pathid + '/comment/' + newKey + '/'] = post;
                firebase.database().ref().update(updates);
                comment.value = null;
            }

            comment.addEventListener('keyup', e => {
                if (e.key === 'Enter') {
                    sendComment();
                }
            })
            btnSendComment.addEventListener('click', e => {
                sendComment();
            })

            // user comment listenr
            firebase.database().ref('/post/' + pathid + '/comment/').on('value', snapshot => {
                var allMsg = '';
                snapshot.forEach(data => {
                    var msg = `<li>${data.val().name} : <em>${data.val().msg}</em></li>`;
                    allMsg += msg;
                })
                postMsg.innerHTML = allMsg;
            })
        })
    }
    // single post END



    // tag relate post START
    var tagCardContainer = document.getElementById('tag-card-container');

    if (tagCardContainer) {
        var postRef = firebase.database().ref('/post');
        var pathid = location.pathname.substring(5, location.pathname.length);
        var count = 0;
        postRef.once('value', snapshot => {
            var allcard = '';
            snapshot.forEach(data => {
                if (pathid === data.val().tag[0].name || pathid === data.val().tag[1].name) {
                    count++;
                    var card = `<div class="col s12 m6 l4">
                    <div class="card hoverable fadeIn">
                        <a href="/post/${data.val().postid}" class="card-image center">
                            <img id="postPhoto" class="center" src="${data.val().photo}">
                        </a>
                    <div class="card-content">
          <span id="postAuthor">
          <a href="/users/${data.val().author}">${data.val().email}</a>
          </span><br />
          <span id="postLocation">
            <i class="material-icons">location_on</i>
            <a href="/location/${data.val().location}">${data.val().location}</a>
          </span><br>
          <ul id="postTag" class="tags">
          <li><a href="/tag/${data.val().tag[0].name}">${data.val().tag[0].name}</a></li>
          <li><a href="/tag/${data.val().tag[1].name}">${data.val().tag[1].name}</a></li>
          </ul>
      </div>
    </div>
  </div>`;
                    allcard += card;
                }
            })
            var title = document.createElement('h2');
            title.textContent = `${pathid}(${count})`;
            title.className = "center light-blue-text text-darken-1 tags";
            tagCardContainer.parentElement.append(title);
            tagCardContainer.innerHTML = allcard;
        })
    }
}
// tag relate post END





//onload END