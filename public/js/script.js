// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()


  
   let taxSwitch=document.getElementById("flexSwitchCheckDefault");
    let tax_info=document.getElementsByClassName("tax-info");
    taxSwitch.addEventListener("click",()=>{
      
      for(tax of tax_info){
      if(tax.style.display !="inline"){
        tax.style.display  ="inline";
          
      }else{
        tax.style.display ="none";
         
      }}
  })

  let srch_bar=document.getElementById("srch-bar");
  let srch_res=document.getElementById("srch-res");
  let cards=document.getElementsByClassName("card-det");

  srch_bar.addEventListener("keyup",()=>{
    srch_res.style.display="block";
    let val=srch_bar.value.toUpperCase();
    for(card of cards){
      let cId=card.getElementsByTagName("a")[1].outerText;
      let cTxt=card.getElementsByTagName("a")[0].outerText.toUpperCase();
      if(cTxt.indexOf(val)>-1){
        let p=document.createElement("p");
        p.innerHTML=`<a href ="/listings/${cId}">${cTxt}</a>`;
        srch_res.prepend(p);  
      }
      else{
      }
    }
  })
  
 let navButton=document.getElementsByClassName("navbar-toggler");
 let filter=document.getElementsByClassName("filters"); 
let switchbtn="false";
navButton[0].addEventListener("click",()=>{
    console.log(switchbtn);
    if(switchbtn==="true")
      {
        filter[0].style.marginTop="0px";
        switchbtn="false" }
      
    if(switchbtn==="false"){
     filter[0].style.marginTop="9rem";
     switchbtn="true" 
     }

})
