// porfolio.js
const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

const resumeFtn = () => {
  window.location.href = "https://drive.google.com/file/d/1rSIp33_aiCkCnbWaymkcxjAPcbzzeOgg/view?usp=sharing";
}

document.addEventListener('DOMContentLoaded', () => {
  // Hamburger menu logic
  const menuOpenBtn = document.getElementById('menu-open-btn');
  const menuCloseBtn = document.getElementById('menu-close-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuOpenBtn) {
    menuOpenBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('hidden');
    });
  }

  if (menuCloseBtn) {
    menuCloseBtn.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  }

  if (mobileNavLinks) {
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // Project type dropdown logic
  const projectTypeButton = document.getElementById('project-type-button');
  const projectTypeList = document.getElementById('project-type-list');
  const projectTypeSelected = document.getElementById('project-type-selected');
  const projectTypeInput = document.getElementById('project-type-input');

  if (projectTypeButton) {
    projectTypeButton.addEventListener('click', () => {
      projectTypeList.classList.toggle('hidden');
    });

    projectTypeList.querySelectorAll('li').forEach(item => {
      item.addEventListener('click', () => {
        projectTypeSelected.textContent = item.textContent;
        projectTypeInput.value = item.dataset.value;
        projectTypeList.classList.add('hidden');
      });
    });

    document.addEventListener('click', function (event) {
      if (!projectTypeButton.contains(event.target) && !projectTypeList.contains(event.target)) {
        projectTypeList.classList.add('hidden');
      }
    });
  }

  // Contact form submission logic
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const form = e.target;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const messageDiv = document.getElementById('form-message');
      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;

      submitButton.innerHTML = 'Sending...';
      submitButton.disabled = true;

      try {
        const response = await fetch('/api/v1/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
          messageDiv.textContent = 'Thank you! message received';
          messageDiv.style.color = 'lightgreen';
          form.reset();
        } else {
          messageDiv.textContent = result.message || 'An error occurred. Please try again.';
          messageDiv.style.color = 'red';
        }
      } catch (error) {
        messageDiv.textContent = 'A network error occurred. Please try again.';
        messageDiv.style.color = 'red';
      } finally {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        setTimeout(() => {
          messageDiv.textContent = '';
        }, 5000);
      }
    });
  }
});
