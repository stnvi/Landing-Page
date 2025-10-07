document.addEventListener('DOMContentLoaded', function() {
    let selectedPack = null;

    // Handle pack selection buttons
    const buttons = document.querySelectorAll('.pack button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'selected' class from all buttons
            buttons.forEach(btn => btn.classList.remove('selected'));
            // Add 'selected' class to clicked button
            this.classList.add('selected');
            // Store selected pack
            selectedPack = this.parentElement.querySelector('h3').textContent;
            alert(`Has seleccionado el pack: ${selectedPack}.`);
        });
    });

    // Handle form submission
    const form = document.querySelector('form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Form validation
        if (!name) {
            alert('Por favor, ingresa tu nombre.');
            return;
        }
        if (!email) {
            alert('Por favor, ingresa tu email.');
            return;
        }
        if (!isValidEmail(email)) {
            alert('Por favor, ingresa un email válido.');
            return;
        }
        if (!message) {
            alert('Por favor, ingresa un mensaje.');
            return;
        }

        // Include selected pack in message
        const fullMessage = selectedPack ? `Pack seleccionado: ${selectedPack}\n\n${message}` : message;

        // Try to send via EmailJS API
        fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service_id: 'service_p5h5pxb',
                template_id: 'template_ccw7clj',
                user_id: '8zLLboMlGRHh3ItCR',
                template_params: {
                    from_name: name,
                    from_email: email,
                    message: fullMessage,
                    to_email: 'ivantorressierra2@gmail.com'
                }
            })
        }).then(response => {
            if (response.ok) {
                alert('Mensaje enviado exitosamente. Gracias por contactarnos.');
                form.reset();
                selectedPack = null;
                buttons.forEach(btn => btn.classList.remove('selected'));
            } else {
                throw new Error('EmailJS API error');
            }
        }).catch(error => {
            console.error('EmailJS API error:', error);
            // Fallback to mailto
            const subject = 'Consulta desde la página web';
            const body = `Nombre: ${name}\nEmail: ${email}\n\n${fullMessage}`;
            const mailtoLink = `mailto:ivantorressierra2@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoLink;
            alert('Abriendo tu cliente de email para enviar el mensaje. Gracias por contactarnos.');
            form.reset();
            selectedPack = null;
            buttons.forEach(btn => btn.classList.remove('selected'));
        });
    });

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});