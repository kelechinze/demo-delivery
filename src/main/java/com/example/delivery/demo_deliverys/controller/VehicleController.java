package com.example.delivery.demo_deliverys.controller;
import com.example.delivery.demo_deliverys.entities.Item;
import com.example.delivery.demo_deliverys.entities.Vehicle;
import com.example.delivery.demo_deliverys.service.ItemService;
import com.example.delivery.demo_deliverys.service.VehicleService;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList; import java.util.List;

@RestController @RequestMapping(value = "/api/v1/vehicle")
public class VehicleController {
    private final VehicleService vehicleService;
    private final ItemService itemService;


    public VehicleController(VehicleService vehicleService, ItemService itemService) {
        this.vehicleService = vehicleService;
        this.itemService = itemService;
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        List<Vehicle> vehicles = vehicleService.getAllVehicles();
        return ResponseEntity.ok(vehicles);
    }

    @PostMapping("/create-vehicle")
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        vehicleService.createVehicle(vehicle);
        return ResponseEntity.ok(vehicle);
    }

    @GetMapping("/get-vehicle/{plateNumber}")
    public ResponseEntity<Vehicle> getVehicleByPlateNumber(@PathVariable String plateNumber) {
        Vehicle vehicle = vehicleService.getByPlateNumber(plateNumber);
        if (vehicle != null) {
            return ResponseEntity.ok(vehicle);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/add-item-to-vehicle/{plateNumber}/item/{itemId}")
    @Transactional
    public ResponseEntity<?> addItemToVehicle(
            @PathVariable String plateNumber,
            @PathVariable Long itemId) {

        try {
            Vehicle vehicle = vehicleService.getByPlateNumber(plateNumber);
            Item item = itemService.getItemById(itemId);

            if (vehicle == null || item == null) {
                return ResponseEntity.notFound().build();
            }

            // Add bidirectional relationship
            item.setVehicle(vehicle);
            vehicle.getItems().add(item);

            // Save both entities
            itemService.createItem(item); // Update the item with vehicle reference
            vehicleService.updateVehicle(vehicle);

            return ResponseEntity.ok(vehicle);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        Vehicle vehicle = vehicleService.findById(id);
        if (vehicle == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(vehicle);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        try {
            vehicleService.deleteVehicle(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }}