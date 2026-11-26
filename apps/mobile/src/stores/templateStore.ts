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
  // Delegation Metadata (US05)
  isDelegated?: boolean;
  delegatedToEmail?: string;
  delegatedHours?: number;
  delegatedUntil?: string;
  isReceivedDelegation?: boolean;
  delegatedFromEmail?: string;
}

export interface TemplateState {
  templates: TemplateItem[];
  receivedTemplates: TemplateItem[];
  addTemplate: (template: Omit<TemplateItem, "id">) => void;
  removeTemplate: (id: number) => void;
  delegateTemplate: (id: number, receiverEmail: string, hours: number) => void;
  revokeDelegation: (id: number) => void;
  addReceivedTemplate: (template: TemplateItem) => void;
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
      isDelegated: false,
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
      isDelegated: false,
    },
  ],
  receivedTemplates: [
    {
      id: 991,
      title: "Kiến trúc Phần mềm – SE301",
      roomName: "Phòng H6-402",
      latitude: 10.7725,
      longitude: 106.6578,
      radiusMeters: 50,
      durationMinutes: 20,
      requireRealtimeGps: true,
      lockDevice: true,
      shiftText: "Được ủy quyền • 09:30",
      beaconText: "Ủy quyền bởi: nvgiang@hcmut.edu.vn",
      beaconActive: true,
      studentCountText: "72 sinh viên",
      isReceivedDelegation: true,
      delegatedFromEmail: "nvgiang@hcmut.edu.vn",
      delegatedHours: 4,
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
  delegateTemplate: (id, receiverEmail, hours) =>
    set((state) => ({
      templates: state.templates.map((tpl) =>
        tpl.id === id
          ? {
              ...tpl,
              isDelegated: true,
              delegatedToEmail: receiverEmail,
              delegatedHours: hours,
              delegatedUntil: new Date(Date.now() + hours * 3600 * 1000).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : tpl
      ),
    })),
  revokeDelegation: (id) =>
    set((state) => ({
      templates: state.templates.map((tpl) =>
        tpl.id === id
          ? {
              ...tpl,
              isDelegated: false,
              delegatedToEmail: undefined,
              delegatedHours: undefined,
              delegatedUntil: undefined,
            }
          : tpl
      ),
    })),
  addReceivedTemplate: (template) =>
    set((state) => ({
      receivedTemplates: [template, ...state.receivedTemplates],
    })),
}));
