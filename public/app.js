const form = document.getElementById('contact-form');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formError = document.getElementById('form-error');
const listMessage = document.getElementById('list-message');
const contactsTable = document.getElementById('contacts-table');
const contactsBody = document.getElementById('contacts-body');

const idInput = document.getElementById('contact-id');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');

// Extract a readable message from an API error response
async function apiError(res) {
    try {
        const data = await res.json();
        if (data.details && data.details.length) {
            return data.details.join(' ');
        }
        return data.error || `Request failed with status ${res.status}`;
    } catch {
        return `Request failed with status ${res.status}`;
    }
}

function showError(message) {
    formError.textContent = message || '';
}

function resetForm() {
    form.reset();
    idInput.value = '';
    formTitle.textContent = 'Add Contact';
    submitBtn.textContent = 'Add Contact';
    cancelBtn.hidden = true;
    showError('');
}

async function loadContacts() {
    try {
        const res = await fetch('/contacts');
        if (!res.ok) {
            throw new Error(await apiError(res));
        }
        const contacts = await res.json();
        renderContacts(contacts);
    } catch (err) {
        listMessage.textContent = `Failed to load contacts: ${err.message}`;
        contactsTable.hidden = true;
    }
}

function renderContacts(contacts) {
    contactsBody.innerHTML = '';
    if (!contacts.length) {
        listMessage.textContent = 'No contacts yet. Add one above.';
        contactsTable.hidden = true;
        return;
    }
    listMessage.textContent = '';
    contactsTable.hidden = false;

    for (const contact of contacts) {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = contact.name;
        const phoneCell = document.createElement('td');
        phoneCell.textContent = contact.phone;
        const emailCell = document.createElement('td');
        emailCell.textContent = contact.email;

        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions';

        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'secondary';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => startEdit(contact));

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'danger';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteContact(contact._id));

        actionsCell.append(editBtn, deleteBtn);
        row.append(nameCell, phoneCell, emailCell, actionsCell);
        contactsBody.appendChild(row);
    }
}

function startEdit(contact) {
    idInput.value = contact._id;
    nameInput.value = contact.name;
    phoneInput.value = contact.phone;
    emailInput.value = contact.email;
    formTitle.textContent = 'Edit Contact';
    submitBtn.textContent = 'Update Contact';
    cancelBtn.hidden = false;
    showError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteContact(id) {
    if (!confirm('Delete this contact?')) {
        return;
    }
    try {
        const res = await fetch(`/contacts/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            throw new Error(await apiError(res));
        }
        // If the deleted contact was being edited, reset the form
        if (idInput.value === id) {
            resetForm();
        }
        await loadContacts();
    } catch (err) {
        alert(`Failed to delete contact: ${err.message}`);
    }
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    showError('');

    const id = idInput.value;
    const payload = {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim(),
    };

    try {
        const res = await fetch(id ? `/contacts/${id}` : '/contacts', {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            throw new Error(await apiError(res));
        }
        resetForm();
        await loadContacts();
    } catch (err) {
        showError(err.message);
    }
});

cancelBtn.addEventListener('click', resetForm);

loadContacts();
