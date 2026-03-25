import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface LicenseApplication {
    id: bigint;
    dob: string;
    licenceType: string;
    fullName: string;
    email: string;
    district: string;
    state: string;
    address: string;
    timestamp: Time;
    mobile: string;
    photo?: ExternalBlob;
    status: string;
    paymentScreenshot?: ExternalBlob;
}
export interface Complaint {
    id: bigint;
    subject: string;
    name: string;
    message: string;
    timestamp: Time;
    image?: ExternalBlob;
    phone: string;
}
export interface PageView {
    sessionId: string;
    page: string;
    timestamp: Time;
}
export interface TrafficStats {
    onlineNow: bigint;
    totalPageViews: bigint;
    recentViews: Array<PageView>;
}
export interface backendInterface {
    getAssociationInfo(): Promise<string>;
    getComplaints(): Promise<Array<Complaint>>;
    getFaqs(): Promise<Array<string>>;
    getLicenseApplications(): Promise<Array<LicenseApplication>>;
    getMembershipFormUrl(): Promise<string>;
    getServices(): Promise<Array<string>>;
    submitComplaint(name: string, phone: string, subject: string, message: string, image: ExternalBlob | null): Promise<bigint>;
    submitLicenseApplication(fullName: string, mobile: string, email: string, dob: string, licenceType: string, address: string, district: string, state: string, photo: ExternalBlob | null, paymentScreenshot: ExternalBlob | null): Promise<bigint>;
    updateLicenseApplicationStatus(id: bigint, status: string): Promise<boolean>;
    recordPageView(page: string, sessionId: string): Promise<void>;
    sendHeartbeat(sessionId: string): Promise<void>;
    getTrafficStats(): Promise<TrafficStats>;
}
