
function toggle(id) {
    var q=document.getElementById(id);
    console.log(q);
    if(q.style.display!='block') q.style.display='block';
    else q.style.display='none';
}

function update(id){
    console.log('update id',id)
    fetch('/ques/'+id).then(function(resp){
        if(resp.status==200){
            return resp.json().then(function(o){
                console.log('success fetching ')
                document.getElementById('newQues').value = o.question;
                document.getElementById('newAns').value = o.answer;
                document.getElementById('newKeywords').value = o.keywords;
                document.getElementById('updateBtn').innerHTML = 'Update';
                document.getElementById("quesForm").action = "/ques/"+id;
            })
        } else console.log('Error! ',resp.status)

    })
}
