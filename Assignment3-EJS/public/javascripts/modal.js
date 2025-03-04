document.addEventListener('DOMContentLoaded', () => {
    const addNewPerfumeButton = document.getElementById('addNewPerfumeButton');
    const closeModalButton = document.getElementById('closeModalButton');
    const perfumeModal = document.getElementById('perfumeModal');
    const cancelButton = document.getElementById('cancelButton');
    const savePerfumeButton = document.getElementById('savePerfumeButton');
    const perfumeForm = document.getElementById('perfumeForm');
    const modalTitle = document.getElementById('modalTitle');
    const perfumeIdInput = document.getElementById('perfumeId');
    const editButtons = document.querySelectorAll('.editButton');

    addNewPerfumeButton.addEventListener('click', () => {
        openModal();
    });

    closeModalButton.addEventListener('click', () => {
        closeModal();
    });

    cancelButton.addEventListener('click', () => {
        closeModal();
    });

    savePerfumeButton.addEventListener('click', () => {
        savePerfume();
    });

    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const perfumeId = event.target.getAttribute('data-id');
            fetch(`/perfumes/${perfumeId}/edit`)
                .then(response => response.json())
                .then(data => {
                    openModal(data);
                });
        });
    });

    function openModal(data = {}) {
        if (data.perfume) {
            modalTitle.textContent = 'Edit Perfume';
            perfumeIdInput.value = data.perfume._id;
            perfumeForm.perfumeName.value = data.perfume.perfumeName;
            perfumeForm.uri.value = data.perfume.uri;
            perfumeForm.price.value = data.perfume.price;
            perfumeForm.concentration.value = data.perfume.concentration;
            perfumeForm.description.value = data.perfume.description;
            perfumeForm.ingredients.value = data.perfume.ingredients;
            perfumeForm.volume.value = data.perfume.volume;
            perfumeForm.targetAudience.value = data.perfume.targetAudience;
            perfumeForm.brand.value = data.perfume.brand;
        } else {
            modalTitle.textContent = 'Add New Perfume';
            perfumeForm.reset();
        }
        perfumeModal.classList.add('is-active');
    }

    function closeModal() {
        perfumeModal.classList.remove('is-active');
    }

    function savePerfume() {
        const formData = new FormData(perfumeForm);
        const id = perfumeIdInput.value;
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/perfumes/${id}` : '/perfumes'

        fetch(url, {
            method: method,
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                closeModal();
                window.location.reload();
            });
    }
});