import { useState, useMemo, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  UserCheck,
  AlertTriangle,
  DollarSign,
  ArrowLeft,
  Sparkles,
  Search,
  User,
  ChevronDown,
  FileText,
  Upload,
  Plus,
  X,
} from "lucide-react";

export type SimulationType = "promotion" | "firing" | "cost-reduction" | "cv-evaluation";

interface SimTypeCard {
  id: SimulationType;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  accentClass: string;
}

const simTypes: SimTypeCard[] = [
  {
    id: "promotion",
    title: "Promotion Readiness Analysis",
    subtitle: "Evaluate employee readiness for the next role",
    icon: UserCheck,
    accentClass: "text-teal-spark",
  },
  {
    id: "firing",
    title: "Firing Decision Analysis",
    subtitle: "Deep-dive into a specific employee's termination impact",
    icon: AlertTriangle,
    accentClass: "text-danger",
  },
  {
    id: "cost-reduction",
    title: "Cost Reduction – Letting Go",
    subtitle: "Identify optimal workforce reduction for budget targets",
    icon: DollarSign,
    accentClass: "text-bmw-blue-light",
  },
  {
    id: "cv-evaluation",
    title: "CV / Candidate Evaluation",
    subtitle: "Evaluate, score & rank candidates from CVs",
    icon: FileText,
    accentClass: "text-teal-spark",
  },
];

interface Employee {
  name: string;
  department: string;
  role: string;
}

const mockEmployees: Employee[] = [
  { name: "Sophie Richter", department: "Product", role: "Product Manager" },
  { name: "Thomas Berg", department: "Operations", role: "Operations Manager" },
  { name: "Anna Keller", department: "Engineering", role: "Senior Developer" },
  { name: "Marcus Lange", department: "Production", role: "Team Lead" },
  { name: "Lisa Müller", department: "Marketing", role: "Marketing Lead" },
  { name: "David Hoffmann", department: "Engineering", role: "Staff Engineer" },
  { name: "Julia Schneider", department: "HR", role: "HR Business Partner" },
  { name: "Felix Braun", department: "Finance", role: "Financial Analyst" },
  { name: "Nina Fischer", department: "Design", role: "UX Lead" },
  { name: "Oliver Weber", department: "Sales", role: "Account Director" },
];

const roles = ["Senior Engineer", "Team Lead", "Department Head", "Director", "VP"];

interface NewSimulationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRunSimulation: (type: SimulationType, data: Record<string, string>) => void;
}

const NewSimulationModal = ({ open, onOpenChange, onRunSimulation }: NewSimulationModalProps) => {
  const [selected, setSelected] = useState<SimulationType | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [cvEntries, setCvEntries] = useState<string[]>([""]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target as Node)) {
        setShowRoleDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredEmployees = useMemo(
    () =>
      mockEmployees.filter(
        (e) =>
          e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.role.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const reset = () => {
    setSelected(null);
    setFormData({});
    setSearchQuery("");
    setShowDropdown(false);
    setShowRoleDropdown(false);
    setCvEntries([""]);
    setUploadedFiles([]);
    setDragActive(false);
  };

  const handleClose = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const handleRun = () => {
    if (!selected) return;
    if (selected === "cv-evaluation") {
      const filledCvs = cvEntries.filter((c) => c.trim());
      const totalCandidates = filledCvs.length + uploadedFiles.length;
      onRunSimulation(selected, {
        ...formData,
        cvs: JSON.stringify(filledCvs),
        cvCount: String(totalCandidates),
        uploadedFiles: JSON.stringify(uploadedFiles.map((f) => f.name)),
      });
    } else {
      onRunSimulation(selected, formData);
    }
    reset();
  };

  const set = (key: string, val: string) => setFormData((p) => ({ ...p, [key]: val }));

  const inputCls =
    "w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all";
  const labelCls = "block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5";

  const selectEmployee = (emp: Employee) => {
    set("name", emp.name);
    setSearchQuery(emp.name);
    setShowDropdown(false);
  };

  /* Unified searchable employee selector – type freely or pick from list */
  const renderEmployeeSelector = () => (
    <div className="relative" ref={dropdownRef}>
      <label className={labelCls}>Employee Name</label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          className={`${inputCls} pl-9 pr-8`}
          placeholder="Search or type employee name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            set("name", e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
        />
        <ChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none transition-transform ${showDropdown ? "rotate-180" : ""}`}
        />
      </div>
      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto rounded-lg border border-white/[0.08] bg-[#0a0e1a]/95 shadow-2xl backdrop-blur-2xl">
          {filteredEmployees.length === 0 && searchQuery.trim() ? (
            <div className="px-4 py-3 text-xs text-muted-foreground">
              No matches — press Enter or click "Run Simulation" to use "<span className="text-foreground">{searchQuery}</span>"
            </div>
          ) : (
            filteredEmployees.map((emp) => (
              <button
                key={emp.name}
                onClick={() => selectEmployee(emp)}
                className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors ${
                  formData.name === emp.name
                    ? "bg-white/[0.08]"
                    : "hover:bg-white/[0.05]"
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-foreground/60" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{emp.name}</p>
                  <p className="text-[11px] text-muted-foreground">{emp.role} · {emp.department}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    const newFiles = files.map((f) => ({ name: f.name, size: `${(f.size / 1024).toFixed(1)} KB` }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newFiles = files.map((f) => ({ name: f.name, size: `${(f.size / 1024).toFixed(1)} KB` }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const renderCvForm = () => (
    <div className="space-y-4">
      <div>
        <label className={labelCls}>Upload CVs</label>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer ${
            dragActive
              ? "border-white/30 bg-white/[0.06]"
              : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
          }`}
          onClick={() => document.getElementById("cv-file-input")?.click()}
        >
          <input id="cv-file-input" type="file" multiple accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleFileInput} />
          <Upload className={`w-8 h-8 mx-auto mb-2 transition-colors ${dragActive ? "text-foreground" : "text-muted-foreground"}`} />
          <p className="text-sm text-foreground font-medium">Drag & drop CV files here</p>
          <p className="text-xs text-muted-foreground mt-1">or click to browse · PDF, DOC, DOCX, TXT</p>
        </div>
        {uploadedFiles.length > 0 && (
          <div className="mt-3 space-y-2">
            {uploadedFiles.map((file, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{file.name}</span>
                  <span className="text-[11px] text-muted-foreground">{file.size}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setUploadedFiles((prev) => prev.filter((_, idx) => idx !== i)); }} className="p-1 rounded hover:bg-white/[0.06] text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <label className={labelCls}>Or paste CV content</label>
        <p className="text-xs text-muted-foreground mb-2">Add candidate qualifications manually.</p>
        <div className="space-y-3">
          {cvEntries.map((cv, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono text-muted-foreground">Candidate {i + 1}</span>
                {cvEntries.length > 1 && (
                  <button
                    onClick={() => setCvEntries((prev) => prev.filter((_, idx) => idx !== i))}
                    className="p-1 rounded hover:bg-white/[0.06] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <textarea
                className={`${inputCls} resize-none`}
                rows={3}
                placeholder={`Paste CV or key qualifications for candidate ${i + 1}...`}
                value={cv}
                onChange={(e) => {
                  const updated = [...cvEntries];
                  updated[i] = e.target.value;
                  setCvEntries(updated);
                }}
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => setCvEntries((prev) => [...prev, ""])}
          className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          Add another candidate
        </button>
      </div>
      <div>
        <label className={labelCls}>Job Position / Requirements (optional)</label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={3}
          placeholder="e.g. Senior Frontend Engineer — React, TypeScript, 5+ years experience..."
          value={formData.jobPosition || ""}
          onChange={(e) => set("jobPosition", e.target.value)}
        />
      </div>
    </div>
  );

  const renderForm = () => {
    switch (selected) {
      case "promotion":
        return (
          <div className="space-y-4">
            {renderEmployeeSelector()}
            <div className="relative" ref={roleDropdownRef}>
              <label className={labelCls}>Next Role</label>
              <button onClick={() => setShowRoleDropdown((p) => !p)} className={`${inputCls} text-left flex items-center justify-between`}>
                <span className={formData.role ? "text-foreground" : "text-muted-foreground"}>{formData.role || "Select target role..."}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showRoleDropdown ? "rotate-180" : ""}`} />
              </button>
              {showRoleDropdown && (
                <div className="absolute z-50 w-full mt-1 rounded-lg border border-white/[0.08] bg-[#0a0e1a]/95 shadow-2xl backdrop-blur-2xl">
                  {roles.map((role) => (
                    <button
                      key={role}
                      onClick={() => { set("role", role); setShowRoleDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        formData.role === role ? "bg-white/[0.08] text-foreground" : "text-foreground/80 hover:bg-white/[0.05]"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case "firing":
        return (
          <div className="space-y-4">
            {renderEmployeeSelector()}
            <div>
              <label className={labelCls}>Additional Notes (optional)</label>
              <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Any context about this employee's situation..." value={formData.notes || ""} onChange={(e) => set("notes", e.target.value)} />
            </div>
          </div>
        );
      case "cost-reduction":
        return (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Financial Situation Summary</label>
              <textarea className={`${inputCls} resize-none`} rows={3} placeholder="e.g. Company is running out of money and needs to increase budget by cutting costs..." value={formData.context || ""} onChange={(e) => set("context", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Budget Increase Target</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">$</span>
                <input className={`${inputCls} pl-8 font-mono`} type="text" placeholder="500,000" value={formData.budget || ""} onChange={(e) => set("budget", e.target.value)} />
              </div>
            </div>
          </div>
        );
      case "cv-evaluation":
        return renderCvForm();
      default:
        return null;
    }
  };

  const selectedType = simTypes.find((s) => s.id === selected);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass border-white/[0.08] max-w-2xl max-h-[85vh] overflow-y-auto p-0">
        <div className="top-glow-border" />
        <div className="p-6">
          <DialogHeader className="mb-6">
            {selected ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setSelected(null); setFormData({}); setSearchQuery(""); setShowDropdown(false); setShowRoleDropdown(false); setCvEntries([""]); setUploadedFiles([]); }}
                  className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                </button>
                <div>
                  <DialogTitle className="font-display text-xl italic text-foreground">{selectedType?.title}</DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-1">{selectedType?.subtitle}</DialogDescription>
                </div>
              </div>
            ) : (
              <>
                <DialogTitle className="font-display text-2xl italic text-foreground">Start New Simulation</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">Choose a simulation type to begin your analysis.</DialogDescription>
              </>
            )}
          </DialogHeader>

          {!selected ? (
            <div className="grid grid-cols-1 gap-3">
              {simTypes.map((sim) => (
                <button
                  key={sim.id}
                  onClick={() => setSelected(sim.id)}
                  className="text-left p-5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all duration-200 group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center ${sim.accentClass} group-hover:scale-110 transition-transform`}>
                      <sim.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{sim.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{sim.subtitle}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div>
              {renderForm()}
              <button
                onClick={handleRun}
                className="w-full mt-6 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-sm bg-gradient-to-r from-bmw-blue to-bmw-blue-light text-foreground hover:-translate-y-0.5 hover:shadow-[0_8px_30px_hsl(var(--bmw-blue)/0.35)] transition-all duration-300"
              >
                <Sparkles className="w-4 h-4" />
                Run Simulation
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewSimulationModal;
