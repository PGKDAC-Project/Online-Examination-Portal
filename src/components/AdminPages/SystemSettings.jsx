import { useEffect, useState } from "react";
import { toast } from "react-toastify";
 
const SystemSettings = () => {
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem('admin_settings');
      return raw ? JSON.parse(raw) : {
        tabSwitchDetection: true,
        fullscreenEnforcement: true,
        maintenanceMode: false,
      };
    } catch {
      return {
        tabSwitchDetection: true,
        fullscreenEnforcement: true,
        maintenanceMode: false,
      };
    }
  });
 
  useEffect(() => {
    localStorage.setItem('admin_settings', JSON.stringify(settings));
  }, [settings]);
 
  const update = (key) => (e) => {
    const next = { ...settings, [key]: e.target.checked };
    setSettings(next);
    toast.success('Setting updated');
  };
 
  return (
    <div className="container-fluid">
      <h1 className="mb-4">System Settings</h1>
      <p className="text-muted">Configure global security and system parameters.</p>

      <div className="card shadow-sm p-4">
        <h4 className="mb-3">Security Policies</h4>
        
        <div className="form-check form-switch mb-3">
          <input 
            className="form-check-input" 
            type="checkbox" 
            id="tabSwitch"
            checked={settings.tabSwitchDetection} 
            onChange={update('tabSwitchDetection')} 
          />
          <label className="form-check-label" htmlFor="tabSwitch">
            Enable Tab Switch Detection
          </label>
        </div>

        <div className="form-check form-switch mb-3">
          <input 
            className="form-check-input" 
            type="checkbox" 
            id="fullscreen"
            checked={settings.fullscreenEnforcement} 
            onChange={update('fullscreenEnforcement')} 
          />
          <label className="form-check-label" htmlFor="fullscreen">
            Enable Fullscreen Enforcement
          </label>
        </div>

        <hr />
        
        <h4 className="mb-3">System Maintenance</h4>
        <div className="form-check form-switch">
          <input 
            className="form-check-input" 
            type="checkbox" 
            id="maintenance"
            checked={settings.maintenanceMode} 
            onChange={update('maintenanceMode')} 
          />
          <label className="form-check-label text-danger" htmlFor="maintenance">
            Maintenance Mode (Locks all user access)
          </label>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
