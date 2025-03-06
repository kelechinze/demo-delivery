// Modal Functions
function showVehicleForm() {
    new bootstrap.Modal(document.getElementById('vehicleModal')).show();
}

function showItemForm() {
    new bootstrap.Modal(document.getElementById('itemModal')).show();
}

// Function to redirect to vehicle details page
function redirectToVehicleDetails() {
    const plateNumber = document.getElementById('searchPlateNumber').value.trim();
    if (plateNumber) {
        window.location.href = `vehicle-details.html?plateNumber=${plateNumber}`;
    } else {
        alert("Please enter a plate number.");
    }
}

// Vehicle Functions
async function loadVehicles() {
    try {
        const response = await fetch('/api/v1/vehicle'); // Correct endpoint
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const vehicles = await response.json();
        if (Array.isArray(vehicles)) {
            renderVehicles(vehicles);
        } else {
            console.error('Expected an array of vehicles, but got:', vehicles);
        }
    } catch (error) {
        console.error('Error loading vehicles:', error);
    }
}

function renderVehicles(vehicles) {
    const container = document.getElementById('vehicles');
    container.innerHTML = vehicles.map(vehicle => `
        <div class="col-md-4">
            <div class="vehicle-card">
                <h4>${vehicle.name}</h4>
                <p class="text-muted">${vehicle.plateNumber}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="status-badge ${vehicle.status ? vehicle.status.toLowerCase() : 'unknown'}">
                        ${vehicle.status || 'Unknown'}
                    </span>
                  <button class="btn btn-sm btn-outline-primary"
                      onclick="window.location.href='vehicle-details.html?plateNumber=${vehicle.plateNumber}'">
                      Details
                  </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteVehicle(${vehicle.id})">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Item Functions
async function loadItems() {
    try {
        const response = await fetch('/api/v1/item');
        if (!response.ok) {
            const errorText = await response.text(); // Log the raw response
            throw new Error(`Network response was not ok: ${errorText}`);
        }
        const items = await response.json();
        if (Array.isArray(items)) {
            renderItems(items);
        } else {
            console.error('Expected an array of items, but got:', items);
        }
    } catch (error) {
        console.error('Error loading items:', error);
    }
}
function renderItems(items) {
    const container = document.getElementById('itemsList'); // Changed to new ID
    container.innerHTML = items.map(item => `
        <div class="col-md-3">
            <div class="item-card">
                <h5>${item.name}</h5>
                <p class="text-muted">${item.code}</p>
                <p>Weight: ${item.weight} kg</p>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteItem(${item.id})">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}
// Form Handlers
document.getElementById('vehicleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        name: document.querySelector('#vehicleForm input[name="name"]').value,
        plateNumber: document.querySelector('#vehicleForm input[name="plateNumber"]').value,
        status: document.querySelector('#vehicleForm input[name="status"]').value,
        type: document.querySelector('#vehicleForm input[name="type"]').value,
        fuelCapacity: parseFloat(document.querySelector('#vehicleForm input[name="fuelCapacity"]').value),
        carryingWeight: parseFloat(document.querySelector('#vehicleForm input[name="carryingWeight"]').value),
        items: [] // Initialize with an empty array or handle items as needed
    };
    try {
        const response = await fetch('/api/v1/vehicle/create-vehicle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (response.ok) {
            location.reload(); // Reload the page to see the new vehicle
        } else {
            console.error('Failed to create vehicle:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById('itemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        name: document.querySelector('#itemForm input[name="name"]').value,
        weight: parseFloat(document.querySelector('#itemForm input[name="weight"]').value),
        code: `ITEM-${Math.floor(Math.random() * 1000)}` // Generate a random code
    };
    try {
        const response = await fetch('/api/v1/item/create-items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (response.ok) {
            location.reload(); // Reload the page to see the new item
        } else {
            console.error('Failed to create item:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Delete Vehicle Function
async function deleteVehicle(vehicleId) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
        try {
            const response = await fetch(`/api/v1/vehicle/${vehicleId}`, { // Updated URL
                method: 'DELETE'
            });
            if (response.ok) {
                alert('Vehicle deleted successfully.');
                location.reload();
            } else {
                const errorText = await response.text(); // Log the raw response
                console.error('Failed to delete vehicle:', errorText);
            }
        } catch (error) {
            console.error('Error deleting vehicle:', error);
        }
    }
}

async function deleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        const url = `/api/v1/item/${itemId}`;
        console.log(`Deleting item: ${url}`);
        try {
            const response = await fetch(url, { method: 'DELETE' });
            if (response.ok) {
                alert('Item deleted successfully.');
                location.reload();
            } else if (response.status === 404) {
                alert('Item not found.');
            } else {
                const errorText = await response.text(); // Log the raw response
                console.error('Failed to delete item:', errorText);
                alert('Failed to delete item. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('An error occurred while deleting the item.');
        }
    }
}



// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadVehicles();
    loadItems();
});
