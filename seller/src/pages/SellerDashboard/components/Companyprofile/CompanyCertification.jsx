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
import { useDispatch, useSelector } from "react-redux";
import { fetchCertificates } from "../../../../redux/slice/certificatesSlice";
import { Spinner } from "@/components/ui/spinner";

export default function CertificateDialog() {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [uploading, setUpoloading] = useState(false);

  const dispatch = useDispatch();
  const {
    items: certificates,
    loading,
    error,
  } = useSelector((state) => state.certificates);

  useEffect(() => {
    dispatch(fetchCertificates());
  }, [dispatch]);

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
      setUpoloading(true);
      const res = await api.post("/company/upload", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Uploaded:", res.data);
      setUpoloading(true);
      dispatch(fetchCertificates());
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
    } finally {
      setUpoloading(false);
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
              <DropdownMenuItem
                onClick={() => openFor("Business Registration")}
              >
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
              <DropdownMenuItem
                onClick={() => openFor("Import Export Code (IEC)")}
              >
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
      <div className="mt-8 w-full">
        <h2 className="text-xl font-semibold text-navyblue mb-4">
          Uploaded Certificates
        </h2>

        {loading ? (
          <div className="text-gray-600">Loading certificates...</div>
        ) : certificates.length === 0 ? (
          <div className="text-gray-500 italic">
            No certificates uploaded yet.
          </div>
        ) : (
          <ul className="space-y-4">
            {certificates.map((cert) => (
              <li
                key={cert._id}
                className="flex justify-between items-center w-full border border-gray-200 bg-white rounded-lg shadow-sm px-6 py-4 hover:shadow-md transition"
              >
                <div className="flex flex-col gap-1 text-sm">
                  <p className="text-base font-semibold text-gray-800">
                    {cert.certificationName}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Owner:</span>{" "}
                    {cert.legalOwner}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Issue:</span>{" "}
                    {cert.issueDate
                      ? new Date(cert.issueDate).toLocaleDateString()
                      : "N/A"}
                    {"  "} | <span className="font-medium">Expires:</span>{" "}
                    {cert.expiryDate
                      ? new Date(cert.expiryDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                {cert.fileUrl && (
                  <a
                    href={cert.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 shrink-0 inline-block px-4 py-2 text-sm font-medium text-white bg-navyblue rounded hover:bg-blue-900 transition"
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
                    <FieldLabel htmlFor="legalOwner">
                      Legal Owner Name
                    </FieldLabel>
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

              <Field
                orientation="horizontal"
                className="justify-end gap-2 mt-4"
              >
                <Button type="submit" onClick={() => setUpoloading(true)}>
                  {" "}
                  {uploading && <Spinner />}
                  {uploading ? "Uploading .." : "Upload Certificate"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpen(false)}
                >
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
