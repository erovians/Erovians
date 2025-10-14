import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  PlusIcon,
  FileTextIcon,
  CheckCircleIcon,
  GlobeIcon,
  ReceiptIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import api from "@/utils/axios.utils";

export default function CertificateDialog() {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    certificationName: "",
    legalOwner: "",
    issueDate: "",
    expiryDate: "",
    sameAsRegistered: false,
    comments: "",
    file: null,
  });

  const openFor = (type) => {
    setSelectedType(type);
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((s) => ({ ...s, [name]: checked }));
      return;
    }
    if (files) {
      setForm((s) => ({ ...s, file: files[0] }));
      return;
    }
    setForm((s) => ({ ...s, [name]: value }));
  };

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await api.get("/company/certificates");
      setCertificates(res.data.certificates);
    } catch (err) {
      console.error("Failed to fetch certificates:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("type", selectedType);
    payload.append("certificationName", form.certificationName);
    payload.append("legalOwner", form.legalOwner);
    payload.append("issueDate", form.issueDate);
    payload.append("expiryDate", form.expiryDate);
    payload.append("sameAsRegistered", form.sameAsRegistered ? "1" : "0");
    payload.append("comments", form.comments);
   
    if (form.file) payload.append("file", form.file);

    try {
      const res = await api.post("/company/upload", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Uploaded:", res.data);
      await fetchCertificates(); // Refresh list
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
    }

    setOpen(false);
    setForm({
      certificationName: "",
      legalOwner: "",
      expiryDate: "",
      sameAsRegistered: false,
      comments: "",
      file: null,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Upload Button + Dropdown */}
      <div className="flex justify-end items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-[50px] w-fit text-white cursor-pointer bg-navyblue hover:border hover:border-navyblue"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Add Certificate
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => openFor("Business Registration")}>
                <FileTextIcon className="mr-2 h-4 w-4" />
                Business Registration
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openFor("Tax Compliance")}>
                <CheckCircleIcon className="mr-2 h-4 w-4" />
                Tax Compliance
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => openFor("Import Export Code (IEC)")}>
                <GlobeIcon className="mr-2 h-4 w-4" />
                Import Export Code (IEC)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openFor("GST Certificate")}>
                <ReceiptIcon className="mr-2 h-4 w-4" />
                GST Certificate
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Certificate List */}
      <div className="mt-6 w-full">
        <h2 className="text-lg font-semibold mb-2">Uploaded Certificates</h2>

        {loading ? (
          <p>Loading certificates...</p>
        ) : certificates.length === 0 ? (
          <p>No certificates uploaded yet.</p>
        ) : (
          <ul className="space-y-3">
            {certificates.map((cert) => (
              <li
                key={cert._id}
                className="p-4 bg-gray-100 rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{cert.certificationName}</p>
                  <p className="text-sm text-gray-600">
                    Owner: {cert.legalOwner} | Issue:{" "}
                    {new Date(cert.issueDate).toLocaleDateString()} | Expires:{" "}
                    {new Date(cert.expiryDate).toLocaleDateString()}
                  </p>
                </div>
                {cert.fileUrl && (
                  <a
                    href={cert.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    View File
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>Upload: {selectedType || "Certificate"}</DialogTitle>
            <DialogDescription>
              Fill certificate details and upload the document.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4">
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Certificate Details</FieldLegend>
                <FieldDescription>
                  Provide the certification details below.
                </FieldDescription>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="certificationName">
                      Name of Certification
                    </FieldLabel>
                    <Input
                      id="certificationName"
                      name="certificationName"
                      placeholder="e.g. MSME Registration"
                      value={form.certificationName}
                      onChange={handleChange}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="legalOwner">Legal Owner Name</FieldLabel>
                    <Input
                      id="legalOwner"
                      name="legalOwner"
                      placeholder="Registered entity / owner's name"
                      value={form.legalOwner}
                      onChange={handleChange}
                      required
                    />
                    <FieldDescription>
                      Name exactly as on the legal document.
                    </FieldDescription>
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="issueDate">Issue Date</FieldLabel>
                      <Input
                        id="issueDate"
                        name="issueDate"
                        type="date"
                        value={form.issueDate}
                        onChange={handleChange}
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="expiryDate">Expiry Date</FieldLabel>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        type="date"
                        value={form.expiryDate}
                        onChange={handleChange}
                        required
                      />
                    </Field>
                  </div>
                </FieldGroup>
              </FieldSet>

              <FieldSeparator />

              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Upload Certificate</FieldLabel>
                    <div className="flex items-center gap-3">
                      <input
                        id="file"
                        name="file"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleChange}
                      />
                      {form.file && (
                        <div className="text-sm truncate max-w-xs">
                          {form.file.name}
                        </div>
                      )}
                    </div>
                    <FieldDescription>
                      Accepted: PDF, JPG, PNG. Max size: (validate on server).
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </FieldSet>

              <Field orientation="horizontal" className="justify-end gap-2 mt-4">
                <Button type="submit">Upload Certificate</Button>
                <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </form>

          <DialogFooter />
        </DialogContent>
      </Dialog>
    </div>
  );
}
















