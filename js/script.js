/* script.js — simple interactions
 * - opens modal with auto-filled subject & recipient
 * - form validation and payload submission (placeholder)
 * - gallery lightbox
 *
 * Replace FORM_ACTION_URL with your Formspree or endpoint.
 */
const FORM_ACTION_URL = 'https://formspree.io/f/your-form-id'; // replace with your form endpoint

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-open-modal]');
  if (btn) {
    openModal(btn.dataset.category, btn.datasetRecipient || btn.datasetRecipient === "" ? btn.datasetRecipient : btn.datasetRecipient);
  }
  if (e.target.matches('.gallery-grid img')) {
    openLightbox(e.target.src);
  }
  if (e.target.matches('.modal') || e.target.matches('.modal .close')) {
    closeModal();
  }
  if (e.target.matches('.lightbox')) closeLightbox();
});

function openModal(category = 'General', recipient = ''){
  const modal = ensureEl('.modal');
  modal.style.display = 'flex';
  modal.querySelector('[name=subject]').value = category;
  modal.querySelector('[name=recipient]').value = recipient;
  setTimeout(()=> modal.querySelector('[name=name]').focus(), 220);
}
function closeModal(){ensureEl('.modal').style.display = 'none';}
function openLightbox(src){const lb = ensureEl('.lightbox');lb.style.display='flex';lb.querySelector('img').src=src}
function closeLightbox(){ensureEl('.lightbox').style.display='none';ensureEl('.lightbox img').src=''}
function ensureEl(sel){return document.querySelector(sel)}

const form = document.querySelector('#contact-form');
if (form){
  form.addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    const name = form.querySelector('[name=name]').value.trim();
    const email = form.querySelector('[name=email]').value.trim();
    const location = form.querySelector('[name=location]').value.trim();
    const message = form.querySelector('[name=message]').value.trim();
    if (!name || !email || !location || !message){
      alert('Please fill all required fields (Name, Email, Location, Message).');
      return;
    }
    const payload = new FormData(form);
    try{
      const resp = await fetch(FORM_ACTION_URL, {method:'POST',body:payload,headers:{'Accept':'application/json'}});
      if (resp.ok){
        alert('Message sent — thank you!');
        form.reset();
        closeModal();
      } else {
        alert('There was an issue sending your message. Please try again later.');
      }
    }catch(err){
      console.error(err);
      alert('Network error. Could not send message.');
    }
  });
}
