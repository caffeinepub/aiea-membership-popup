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
export interface Complaint {
    id: bigint;
    subject: string;
    name: string;
    message: string;
    timestamp: Time;
    image?: ExternalBlob;
    phone: string;
}
export type Time = bigint;
export interface backendInterface {
    getAssociationInfo(): Promise<string>;
    getComplaints(): Promise<Array<Complaint>>;
    getFaqs(): Promise<Array<string>>;
    getMembershipFormUrl(): Promise<string>;
    getServices(): Promise<Array<string>>;
    submitComplaint(name: string, phone: string, subject: string, message: string, image: ExternalBlob | null): Promise<bigint>;
}
