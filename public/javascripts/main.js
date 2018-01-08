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



    //initial Google mpas
    var mapContainer = document.getElementById('map-container');
    if (mapContainer) {
        function initialize() {
            new google.maps.places.Autocomplete(
                (document.getElementById('autocomplete')), {
                    types: ['geocode']
                });
        }

        initialize();
    }



    var textEmail = document.getElementById('textEmail');
    var textPassword = document.getElementById('textPassword');
    var btnSignUp = document.getElementById('btnSignUp');
    var btnLogin = document.getElementById('btnLogin');
    var btnLogout = document.getElementById('btnLogout');
    var userName = document.getElementById('userName');
    var user;

    const LOADING_PICTURE = `<img src='https://loading.io/spinners/pinkpig/index.pink-pig-ajax-loader.gif' />`;

    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            user = firebaseUser;
            console.log(firebaseUser.uid);
            userName.textContent = firebaseUser.email;
        } else {
            console.log('Not logged in');
        }
    })




    function login(email, password) {
        firebase.auth().signInWithEmailAndPassword(email, password).catch(e => alert(e));
    }

    function register(email, password) {
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(e => console.log(e.message));
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
            reigster(email, password);
            login(email, password);
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
        var postAuthor = document.getElementById('postAuthor');
        var postPhoto = document.getElementById('postPhoto');
        var postRef = firebase.database().ref('/');

        postRef.once('value', snapshot => {
            var allcard = '';
            snapshot.forEach(data => {
                var card = `<div class="col s12 m6 l4">
                <div class="card hoverable">
                  <div class="card-image">
                    <img id="postPhoto" src="${data.val().photo}">
                  </div>
                  <div class="card-content">
                    <p>
                      <span id="postAuthor">
                      ${data.val().author}
                      </span>
                      <br />
                      <span id="postLocation">
                        <i class="material-icons">location_on</i>
                        ${data.val().location}
                      </span>
                      <br>
                      <span id="postTag">
                      ${data.val().tag}
                      </span>
                    </p>
                  </div>
                </div>
              </div>`
                    ;
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
            uploadContainer.appendChild(loading);

            var postRef = firebase.database().ref('/');
            var photoRef = firebase.storage().ref('/' + user.uid + '/' + file.name);
            photoRef.put(file, { 'contentType': file.type }).then(snapshot => {
                var post = {
                    'author': user.uid,
                    'photo': snapshot.downloadURL,
                    'location': autocomplete.value,
                    'tag': ['1', '2', '3']
                }
                postRef.push(post);
                setTimeout(() => {
                    alert('上傳成功');
                    window.history.back();
                }, 1000);
            })

        })
    }
    // fileUpload END

}//onload End