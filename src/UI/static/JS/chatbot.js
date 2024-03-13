// $(document).ready(function() {
//     $('#send').click(function() {
//         var message = $('#input').val();
//         $('#input').val('');
//         $('#messages').append('<p><strong>You:</strong> ' + message + '</p>');
//         console.log(message)
//         $.ajax({
//             type: "POST",
//             url: '/ask',
//             contentType: 'application/json',
//             data: JSON.stringify({ user_input: message }),
//             success: function(data) {
//                 $('#messages').append('<p><strong>Bot:</strong> ' + data.message + '</p>');
//             }
//         });
//     });
// });
var answer_counter=1;
var details_object= {};

function addMoreInfoIcon(container){
    // Create span element
    var moreInfoIconSpan = document.createElement("span");
    moreInfoIconSpan.id = `more-info-${answer_counter}`;
    moreInfoIconSpan.classList.add("more-info-icon-container");

    // Create img element
    var imgElement = document.createElement("img");
    imgElement.setAttribute("src", "/static/images/info-icon.svg");
    imgElement.setAttribute("alt", "");

    // Append img element to span element
    moreInfoIconSpan.appendChild(imgElement);

    moreInfoIconSpan.addEventListener('click',function(){
        let id=moreInfoIconSpan.id;
        let answer_index=id[id.length - 1];
        console.log("answer index: ",answer_index);
        let element=details_object[answer_index];
        console.log("Element Inner HTML:"+element.innerHTML);
        let more_details_component=document.getElementById("more-details-component");
        more_details_component.append(element);
        more_details_component.style.display="block";
        
        

    })

    // Append span element to a parent element (assuming you have a parent element with id "container")
    container.appendChild(moreInfoIconSpan);
    answer_counter++;
}

function displayPermissionTable(data){
    let license_ids=data.info.license_ids;
    let license_titles=data.info.license_titles;
    let license_permissions=data.info.license_permissions;

    var license_instance = license_permissions[0]
    var allkeys=[...Object.keys(license_instance[0]),...Object.keys(license_instance[1]),...Object.keys(license_instance[2])];
    let element= document.createElement("div")
    element.id=`more-details-content-${answer_counter}`
    var htmlCode=`<div id="table-container" class="table-responsive"><table class="table table-dark table-striped rounded-3 overflow-hidden">
    <thead><tr><th scope="col" class="text-nowrap text-center p-3">Recommended Licenses</th>`; 
    for (let key of allkeys) {
        htmlCode += `<th scope="col" class="text-nowrap text-center p-3">${key}</th>`;
    }
    htmlCode += `</tr></thead><tbody>`;
    var counter=0;
    
    for (let license of license_permissions) {
        let permissions = Object.values(license[0]);
        let conditions = Object.values(license[1]);
        let limitations = Object.values(license[2]);
        htmlCode+=`<tr>`;
        htmlCode+=`<td class="text-nowrap " >${license_titles[counter]}</td>`
        for (let value of permissions) {
            if(value==1)
                htmlCode+=`<td class="text-center"><img src="static/images/check-mark.svg" alt=""></td>`
            else
                htmlCode+=`<td class="text-center"><img src="static/images/cross-mark.svg" alt=""></td>`
            
        }
        for (let value of conditions) {
            if(value==1)
                htmlCode+=`<td class="text-center"><img src="static/images/check-mark.svg" alt=""></td>`
            else
                htmlCode+=`<td class="text-center"><img src="static/images/cross-mark.svg" alt=""></td>`
            
        }
        for (let value of limitations) {
            if(value==0)
                htmlCode+=`<td class="text-center"><img src="static/images/check-mark.svg" alt=""></td>`
            else
                htmlCode+=`<td class="text-center"><img src="static/images/cross-mark.svg" alt=""></td>`
            
        }
        counter++;
        htmlCode+=`</tr>`;

        
    }
    htmlCode+=`</tbody>
    </table>
    </div>`;
    element.insertAdjacentHTML('beforeend', htmlCode);
    details_object[`${answer_counter}`]=element;
    console.log("Element Inner HTML:"+element.innerHTML);
    console.log(details_object)
   
    // document.getElementById("more-details-component").style.display="block";
}
function askChatbot(message){
    $.ajax({
    type: "POST",
    url: '/ask',
    contentType: 'application/json',
    data: JSON.stringify({ user_input: message }),
    success: function(data) {
        console.log("Succeeded response")

        // Create chat-block element
        var chatBlock = document.createElement("div");
        chatBlock.classList.add("chat-block");

        // Create bot-icon-block element
        var botIconBlock = document.createElement("div");
        botIconBlock.classList.add("bot-icon-block");

        // Create bot-icon-text element
        var botIconText = document.createElement("div");
        botIconText.classList.add("bot-icon-text");
        botIconText.textContent = "Bot"; // Set text content

        // Create bot-icon element
        var botIcon = document.createElement("div");
        botIcon.classList.add("bot-icon");

        // Create bot-image element
        var botImage = document.createElement("img");
        botImage.classList.add("bot-image");
        botImage.setAttribute("src", "/static/images/bot.png");
        botImage.setAttribute("alt", "A bot icon");

        // Append botImage to bot-icon
        botIcon.appendChild(botImage);

        // Append botIconText and botIcon to botIconBlock
        botIconBlock.appendChild(botIconText);
        botIconBlock.appendChild(botIcon);


        // Create question-block element
        var questionBlock = document.createElement("div");
        questionBlock.classList.add("question-block");
        questionBlock.textContent = data.message; // Set text content
        
       

        // Create load container element
        var loadContainer = document.createElement("div");
        loadContainer.classList.add("load");

        // Create three progress divs and append them to the load container
        for (var i = 0; i < 3; i++) {
            var progressDiv = document.createElement("div");
            progressDiv.classList.add("progress");
            loadContainer.appendChild(progressDiv);
            
        }

        // Append load container to a parent element (assuming you have a parent element with id "container")
        
        
        // Append botIconBlock and questionBlock to chatBlock
        chatBlock.appendChild(botIconBlock);
        chatBlock.appendChild(loadContainer);
        
        document.getElementById("conversation").appendChild(chatBlock);

        setTimeout(function() {
            loadContainer.remove();
            chatBlock.appendChild(questionBlock);
            console.log(data.info);
            console.log(data.info)
            if (data.info !== null){

                if(data.info.key === "permission_suggested_licenses"){
                    displayPermissionTable(data);
                    addMoreInfoIcon(chatBlock)
                    

                }
            }
            
            questionBlock.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
            document.getElementById("message-component").style.display="flex"
        }, 2000);

        // Append chatBlock to a parent element (assuming you have a parent element with id "conversation")

    }
});
}
function handleUserInput(){
    document.getElementById("message-component").style.display="none"
    let user_text=document.getElementById("messageInput").value;
    document.getElementById("messageInput").value=""

    // Create chat-block element
    var chatBlock = document.createElement("div");
    chatBlock.classList.add("chat-block");

    // Create user-icon-block element
    var userIconBlock = document.createElement("div");
    userIconBlock.classList.add("user-icon-block");

    // Create user-icon-text element
    var userIconText = document.createElement("div");
    userIconText.classList.add("user-icon-text");
    userIconText.textContent = "You"; // Set text content

    // Create user-icon element
    var userIcon = document.createElement("div");
    userIcon.classList.add("user-icon");

    // Create user-image element
    var userImage = document.createElement("img");
    userImage.classList.add("user-image");
    userImage.setAttribute("src", "/static/images/user2.png");
    userImage.setAttribute("alt", "A user icon");

    // Append userImage to user-icon
    userIcon.appendChild(userImage);

    // Append userIconText and userIcon to userIconBlock
    userIconBlock.appendChild(userIconText);
    userIconBlock.appendChild(userIcon);

    // Create question-block element
    var questionBlock = document.createElement("div");
    questionBlock.classList.add("question-block");
    questionBlock.textContent = user_text; // Set text content

    // Append userIconBlock and questionBlock to chatBlock
    chatBlock.appendChild(userIconBlock);
    chatBlock.appendChild(questionBlock);

    // Append chatBlock to a parent element (assuming you have a parent element with id "conversation")
    document.getElementById("conversation").appendChild(chatBlock);
    askChatbot(user_text)
}

var send_button=document.getElementById("sendButton");
var cloce_icon= document.getElementById("close-icon").addEventListener("click",function(){
    children=Array.from(this.parentNode.children).filter(item=>item!=this);
    for( child of children){
        child.remove();
    }
    document.getElementById("more-details-component").style.display="none";
})

send_button.addEventListener("click", handleUserInput);
messageInput=document.getElementById("messageInput").addEventListener("keydown", function(event){
    if (event.key === 'Enter') {
        handleUserInput();
      }
});