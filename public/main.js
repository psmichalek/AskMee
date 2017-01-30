
function toggle(id) {
    var q=document.getElementById(id);
    console.log(q);
    if(q.style.display!='block') q.style.display='block';
    else q.style.display='none';
}

function update(id){
    console.log('update')
    fetch('/ques/'+id).then(function(resp){
        return resp.json().then(function(o){
            console.log(o)
        })
        // document.getElementById('newQues').value = q;
        // document.getElementById('newAns').value = a;
        // document.getElementById('newKeywords').value = k;
    })
}
