import { useState, type FormEvent } from "react";
import Input, { Select } from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useAuth } from "@/context/AuthContext";
import { profService } from "@/services/profService";
import { toLocalDate, toLocalTime } from "@/utils/formatters";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

interface Props {
  subjectId: number;
  defaultYear?: number;
  defaultSemester?: number;
  defaultDivision?: string;
}

export default function CreateLectureForm({
  subjectId,
  defaultYear = 2,
  defaultSemester = 3,
  defaultDivision = "A",
}: Props) {
  const { professor } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [f, setF] = useState({
    lectureDate: toLocalDate(new Date()),
    startTime: "10:00",
    endTime: "11:00",
    topic: "",
    roomNo: "",
    year: defaultYear,
    semester: defaultSemester,
    division: defaultDivision,
  });

  const update = (patch: Partial<typeof f>) => setF((p) => ({ ...p, ...patch }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!professor) return toast.error("Professor session missing");
    setSubmitting(true);
    try {
      const created = await profService.createLecture({
        lectureDate: toLocalDate(f.lectureDate),
        startTime: toLocalTime(f.startTime),
        endTime: toLocalTime(f.endTime),
        topic: f.topic,
        roomNo: f.roomNo,
        year: Number(f.year),
        semester: Number(f.semester),
        division: f.division,
        subjectId,
        professorId: professor.professorId,
        departmentId: professor.departmentId,
      });
      toast.success("Lecture created", { description: f.topic });
      const newId = Number(created?.lectureId || subjectId);
      navigate({ to: "/attendance-session/$lectureId", params: { lectureId: String(newId) } });
    } catch (err) {
      toast.error("Could not create lecture", { description: (err as Error).message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        <Input type="date" label="Lecture date" value={f.lectureDate} onChange={(e) => update({ lectureDate: e.target.value })} required />
        <Input type="time" label="Start time" value={f.startTime} onChange={(e) => update({ startTime: e.target.value })} required />
        <Input type="time" label="End time" value={f.endTime} onChange={(e) => update({ endTime: e.target.value })} required />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Topic" placeholder="Binary Search Trees" value={f.topic} onChange={(e) => update({ topic: e.target.value })} required />
        <Input label="Room number" placeholder="Seminar Hall B" value={f.roomNo} onChange={(e) => update({ roomNo: e.target.value })} required />
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <Select label="Year" value={f.year} onChange={(e) => update({ year: Number(e.target.value) })}>
          {[1, 2, 3, 4].map((y) => <option key={y} value={y}>{y}</option>)}
        </Select>
        <Select label="Semester" value={f.semester} onChange={(e) => update({ semester: Number(e.target.value) })}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Select label="Division" value={f.division} onChange={(e) => update({ division: e.target.value })}>
          {["A", "B", "C"].map((d) => <option key={d} value={d}>{d}</option>)}
        </Select>
      </div>
      <div className="flex justify-end">
        <Button type="submit" loading={submitting}>Schedule Lecture</Button>
      </div>
    </form>
  );
}
