import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSpecialties, getDoctorByIdAdmin } from "@/lib/data/admin";
import { EditDoctorForm } from "./EditDoctorForm";

export const metadata: Metadata = { title: "Editar médico | Painel administrativo" };

export default async function EditarMedicoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [doctor, specialties] = await Promise.all([getDoctorByIdAdmin(id), getAllSpecialties()]);
  if (!doctor) notFound();

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-center text-2xl font-semibold text-ink-900">Editar médico</h1>
      <p className="mt-1 text-center text-sm text-ink-600">{doctor.fullName}</p>

      <div className="mt-6 rounded-card border border-ink-100 bg-surface p-6 shadow-soft">
        <EditDoctorForm
          doctorId={doctor.id}
          specialties={specialties}
          initialValues={{ crm: doctor.crm, specialty_id: doctor.specialty_id, bio: doctor.bio }}
        />
      </div>
    </div>
  );
}
