
function toggle(id) {
    var ans = document.getElementById('a_'+id);
    var ques = document.getElementById('q_'+id);

    function _modQ(w,c,b,s){
        ques.style.fontWeight = w;
        ques.style.color = c;
        ques.style.borderBottom = b;
        ques.style.fontSize = s;
    }
    if(ans.style.display!='block') {
        ans.style.display = 'block';
        _modQ('bold','orange','none','0.95em');
    }else {
        ans.style.display = 'none';
        _modQ('normal','','1px dotted #ccc','0.75em');
    }
}

function update(id){
    console.log('update id',id)
    fetch('/ques/'+id).then(function(resp){
        if(resp.status==200){
            return resp.json().then(function(o){
                if(typeof o.success==='undefined' || (typeof o.success!=='undefined' && o.success) ){
                    console.log('success fetching ',o)
                    document.getElementById('newQues').value = o.question;
                    document.getElementById('newAns').value = o.answer;
                    document.getElementById('newKeywords').value = o.keywords;
                    document.getElementById('updateBtn').innerHTML = 'Update';
                    document.getElementById("quesForm").action = "/ques/"+id;
                    document.getElementById("updatee").innerHTML = o.uid;
                    document.getElementById("updateeFld").style.display='block';
                } else {
                    if(o.error){
                        document.getElementById("respErr").innerHTML = 'An error occurred: '+o.error;
                        document.getElementById("respErr").style.display ='block';
                        document.getElementById("respErr").style.color ='red';
                    }
                }
            })
        } else console.log('Error! ',resp.status)
    })
}

function filter(sel){
    if(sel.value.trim()=='all'||sel.value.trim()==''){
        window.location.assign('/');
    } else{
        console.log('filter on: '+sel.value)
        var form = document.createElement('form');
        form.method = 'post';
        form.action = '/';
        form.appendChild(sel)
        form.submit();
    }
}

function resetform(){
    document.getElementById("updatee").innerHTML = '';
    document.getElementById("updateeFld").style.display='none';
}
