(()=>{
  'use strict';
  const old=document.querySelector('.v38-launchpad');
  if(!old || document.querySelector('#jp-v103')) return;

  const services=[
    ['TV & Home Theater','tv'],
    ['Rough-In Wiring & Prewiring','rough-in'],
    ['Networking','network'],
    ['Smart Home & Security','smart'],
    ['Audio / Video','audio'],
    ['Other Project','other']
  ];

  const panel=document.createElement('section');
  panel.id='jp-v103';
  panel.setAttribute('aria-label','Start your project');
  panel.innerHTML=`
    <div class="eyebrow">Just Protect / Start Your Project</div>
    <h2>Tell us what you're building.</h2>
    <p>Choose your service, describe the work, and take the first step toward a custom quote.</p>
    <div class="choices" role="group" aria-label="Project service"></div>
    <label for="jp-v103-state">Where is your project?</label>
    <select id="jp-v103-state">
      <option value="">Select your state</option>
      <option>Illinois</option><option>Indiana</option>
      <option>Michigan</option><option>Ohio</option>
    </select>
    <label for="jp-v103-details">Tell us about your project</label>
    <textarea id="jp-v103-details" rows="4"
      placeholder="What would you like installed, upgraded, or prewired?"></textarea>
    <div class="actions">
      <button class="action" type="button" id="jp-v103-quote">Prepare Quote Request</button>
    </div>
    <p class="note" id="jp-v103-status" role="status">
      Photo attachments are coming with the secure quote submission system.
      This version prepares an email request; it does not upload files.
    </p>
  `;

  const choices=panel.querySelector('.choices');
  let selected='';

  services.forEach(([name,id])=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='choice';
    button.textContent=name;
    button.setAttribute('aria-pressed','false');
    button.addEventListener('click',()=>{
      selected=name;
      choices.querySelectorAll('button').forEach(b=>
        b.setAttribute('aria-pressed',String(b===button))
      );
    });
    choices.append(button);
  });

  panel.querySelector('#jp-v103-quote').addEventListener('click',()=>{
    const state=panel.querySelector('#jp-v103-state').value;
    const details=panel.querySelector('#jp-v103-details').value.trim();
    const status=panel.querySelector('#jp-v103-status');

    if(!selected || !state || !details){
      status.textContent='Please select a service and state, and describe your project.';
      return;
    }

    const subject='Just Protect Quote Request — '+selected;
    const body=[
      'Service: '+selected,
      'State: '+state,
      '',
      'Project description:',
      details,
      '',
      'Please contact me to discuss the project.',
      'Name:',
      'Phone:',
      'Project ZIP code:'
    ].join('\n');

    window.location.href='mailto:owners@justprotectllc.com?subject='+
      encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    status.textContent='Your email app should open with the quote request. Please send the email to submit it.';
  });

  old.parentNode.insertBefore(panel,old);
})();
