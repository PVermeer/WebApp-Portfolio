import { ContentTextDocumentLean, ContentImageDocumentLean, ContentPageDocumentLean, ContentFileDocumentLean, ContentListDocumentLean } from "../../../../../../server/database/models/content/content.types";

// Extend interfaces for Form options
export interface ContentTextExt extends ContentTextDocumentLean {
  placeholderText: string;
  typeText: string;
  alertText: string;
  typeHeader: string;
  alertHeader: string;
}
export interface ContentListExt extends ContentListDocumentLean {
  placeholderText: string;
  typeText: string;
  alertText: string;
  typeHeader: string;
  alertHeader: string;
}
export interface ContentImageExt extends ContentImageDocumentLean {
  typeTitle: string;
  alert: string;
}
export interface ContentFileExt extends ContentFileDocumentLean {
  typeTitle: string;
  alert: string;
}
export interface ContentImageSubmit extends ContentImageDocumentLean {
  imageUpdate: Blob;
}
export interface ContentFileSubmit extends ContentFileDocumentLean {
  fileUpdate: Blob;
}
export interface ContentPageDocumentExt extends ContentPageDocumentLean {
  texts: ContentTextExt[];
  lists: ContentListExt[];
  images: ContentImageExt[];
  files: ContentFileExt[];
}
export interface ContentPageLeanSubmit extends ContentPageDocumentLean {
  images: ContentImageSubmit[];
  files: ContentFileSubmit[];
}
