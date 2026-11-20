import { create } from "zustand";

export interface TemplateItem {
  id: number;
  title: string;
  roomName: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  durationMinutes: number;
  requireRealtimeGps?: boolean;
  lockDevice?: boolean;
  shiftText?: string;
  beaconText?: string;
  beaconActive?: boolean;
  studentCountText?: string;
}

export interface TemplateState {
  templates: TemplateItem[];
  addTemplate: (template: Omit<TemplateItem, "id">) => void;
  removeTemplate: (id: number) => void;
}

export const useTemplateStore = create<TemplateState>((set) => ({
  templates: [
    {
      id: 1,
      title: "Lập trình Mobile – IT001",
      roomName: "Phòng A201",
      latitude: 10.76262,
      longitude: 106.68231,
      radiusMeters: 50,
      durationMinutes: 10,
      requireRealtimeGps: true,
      lockDevice: true,
      shiftText: "Ca sáng • 07:30",
      beaconText: "Beacon: Trạm A201–01",
      beaconActive: true,
      studentCountText: "65 sinh viên",
    },
    {
      id: 2,
      title: "Cơ sở dữ liệu – CS201",
      roomName: "Phòng B103",
      latitude: 10.7725,
      longitude: 106.6578,
      radiusMeters: 30,
      durationMinutes: 15,
      requireRealtimeGps: true,
      lockDevice: true,
      shiftText: "Ca chiều • 13:30",
      beaconText: "Beacon: Trạm B103–02",
      beaconActive: false,
      studentCountText: "58 sinh viên",
    },
  ],
  addTemplate: (newTemplate) =>
    set((state) => ({
      templates: [
        {
          shiftText: "Ca học • Đã lưu",
          beaconText: "Beacon: Trạm tự động",
          beaconActive: true,
          studentCountText: "60 sinh viên",
          ...newTemplate,
          id: Date.now(),
        },
        ...state.templates,
      ],
    })),
  removeTemplate: (id) =>
    set((state) => ({
      templates: state.templates.filter((item) => item.id !== id),
    })),
}));
