package com.oep.entities;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "system_settings")
@AttributeOverride(name = "id", column = @Column(name = "settings_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SystemSettings extends BaseEntity {

    @Column(name = "maintenance_mode", nullable = false)
    private boolean maintenanceMode = false;

    @Column(name = "tab_switch_detection", nullable = false)
    private boolean tabSwitchDetection = true;

    @Column(name = "fullscreen_enforcement", nullable = false)
    private boolean fullscreenEnforcement = true;

    @Column(name = "exam_auto_submit", nullable = false)
    private boolean examAutoSubmit = true;
}
