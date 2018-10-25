document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();
    const firestore = firebase.firestore();
    firebase.firestore().settings({ timestampsInSnapshots: true });
    const myPost = firestore.collection('posts').doc('firstpost');
    myPost.onSnapshot(doc => {
        const data = doc.data();
        document.querySelector('#title').innerHTML = `${data.title} - <i> ${(new Date(data.createdOn.seconds * 1000))}</i>`;

    });
});

googleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(result => {
        const user = result.user;
        document.write(`Hello ${user.displayName} (${user.email})`);
        console.log(user);
    });
}

getData = () => {
    const firestore = firebase.firestore();
    firebase.firestore().settings({ timestampsInSnapshots: true });
    const myPost = firestore.collection('posts').doc('firstpost');
    myPost.get().then(doc => {
        const data = doc.data();
        console.log(data);
        document.write(data.title + `<br>`);
        document.write(new Date(data.createdOn.seconds * 1000) + `<br>`);
    })
}



updatePosts = e => {
    document.querySelector('#txtInput').addEventListener('keypress', (e) => {
        let key = e.which || e.keyCode;
        if (key === 13) { // 13 is enter
            const firestore = firebase.firestore();
            firebase.firestore().settings({ timestampsInSnapshots: true });
            const myPost = firestore.collection('posts').doc('firstpost');
            myPost.update({
                title: e.target.value,
                createdOn:{seconds:(Date.now() / 1000)} 
            });
        }
    })

}

getProducts = () => {
    const firestore = firebase.firestore();
    firebase.firestore().settings({ timestampsInSnapshots: true });
    const myProducts = firestore.collection('products');
    const query = myProducts.where('price', '>', 9).orderBy('price', 'desc').limit(2);
    query.get().then(products => {
        document.write('List Product(s) {Price > 9, Desc Order} <br>');
        products.forEach(doc => {
            const data = doc.data();
            document.write(`${data.name} @ ${data.price} <br>`);
        })

    })
}

uploadFile = (files) => {
    const storageRef = firebase.storage().ref();
    const imgRef = storageRef.child('image_' + Math.random(1, 10000) + '.jpg');
    const file = files.item(0);
    const task = imgRef.put(file);
    task.then(snapshot => {
        document.querySelector('#imgInfo').innerHTML = `File Name: <b>${snapshot.metadata.name}</b> <br>
        Size: <b>${snapshot.metadata.size / 1000} KB</b><br>
        Bucket: <b>${snapshot.metadata.bucket}</b><br>
        Type: <b>${snapshot.metadata.contentType}</b>`;
        task.snapshot.ref.getDownloadURL().then(downloadURL => {
            const imageUrl = downloadURL;
            document.querySelector('#imageUpload').setAttribute('src', imageUrl);

        })

    })
}

