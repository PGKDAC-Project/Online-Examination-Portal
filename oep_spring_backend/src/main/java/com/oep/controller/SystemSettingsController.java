package com.oep.controller;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/settings")
public class SystemSettingsController {

    @GetMapping
    public ResponseEntity<?> getSettings() {
        // Returning default settings to silence 404s and enable UI features
        return ResponseEntity.ok(Map.of(
                "maintenanceMode", false,
                "tabSwitchDetection", true,
                "fullscreenEnforcement", true,
                "examAutoSubmit", true));
    }
}
