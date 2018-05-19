import { ContentTextDocumentLean, ContentImageDocumentLean, ContentPageDocumentLean } from "../../../../../server/database/models/content/content.types";

// Extend interfaces for Form options
export interface ContentTextExt extends ContentTextDocumentLean {
  placeholderText: string;
  formControlNameText: string;
  typeText: string;
  alertText: string;

  placeholderHeader: string;
  formControlNameHeader: string;
  typeHeader: string;
  alertHeader: string;
}
export interface ContentImageExt extends ContentImageDocumentLean {
  imageSrc: any;
  formControlNameImage: string;

  placeholderTitle: string;
  formControlNameTitle: string;
  typeTitle: string;
  alertTitle: string;
}
export interface ContentImageSubmit extends ContentImageDocumentLean {
  imageUpdate: Blob;
}
export interface ContentPageDocumentExt extends ContentPageDocumentLean {
  texts: ContentTextExt[];
  images: ContentImageExt[];
}
export interface ContentPageLeanSubmit extends ContentPageDocumentLean {
  images: ContentImageSubmit[];
}
