import React, { useState } from "react";
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
  Trash2Icon,
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
  const [form, setForm] = useState({
    certificationName: "",
    legalOwner: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("type", selectedType);
    payload.append("certificationName", form.certificationName);
    payload.append("legalOwner", form.legalOwner);
    payload.append("expiryDate", form.expiryDate);
    payload.append("sameAsRegistered", form.sameAsRegistered ? "1" : "0");
    payload.append("comments", form.comments);
    payload.append("companyId", "6717e47f9f4c3b55d9f12345");
    if (form.file) payload.append("file", form.file);

    try {
      const res = await api.post("/company/upload", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Uploaded:", res.data);
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
    <div className="flex flex-wrap justify-end items-center gap-2">
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

      {/* Dialog */}
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
                      Accepted: PDF, JPG, PNG. Max size: (implement on
                      server-side).
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </FieldSet>

              <Field
                orientation="horizontal"
                className="justify-end gap-2 mt-4"
              >
                <Button type="submit">Upload Certificate</Button>
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
