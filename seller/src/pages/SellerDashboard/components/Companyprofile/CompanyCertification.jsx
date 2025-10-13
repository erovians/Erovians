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

 

//   const handleSubmit = async (e) => {
//   e.preventDefault();

//  // Create a simplified payload
//   const payload = {
//     type: selectedType,
//     certificationName: form.certificationName,
//     legalOwner: form.legalOwner,
//     expiryDate: form.expiryDate,
//     sameAsRegistered: form.sameAsRegistered,
//     comments: form.comments,
//     file: form.file?.name || null, 
//   };
 
   
//     console.log("Certificate uploaded:", payload);
//     alert("Certificate uploaded successfully");

//     // Close dialog
//     setOpen(false);

//     // Reset form
//     setForm({
//       certificationName: "",
//       legalOwner: "",
//       expiryDate: "",
//       sameAsRegistered: false,
//       comments: "",
//       file: null,
//     });
 
// };
const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("type", selectedType);
  formData.append("certificationName", form.certificationName);
  formData.append("legalOwner", form.legalOwner);
  formData.append("expiryDate", form.expiryDate);
  formData.append("sameAsRegistered", form.sameAsRegistered);
  formData.append("comments", form.comments);
  if (form.file) {
    formData.append("file", form.file);
  }

  try {
    const res = await fetch("/api/certificates", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to upload");

    alert("Certificate uploaded successfully");
    setOpen(false);
    setForm({
      certificationName: "",
      legalOwner: "",
      expiryDate: "",
      sameAsRegistered: false,
      comments: "",
      file: null,
    });
  } catch (err) {
    console.error(err);
    alert("Upload failed");
  }
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
