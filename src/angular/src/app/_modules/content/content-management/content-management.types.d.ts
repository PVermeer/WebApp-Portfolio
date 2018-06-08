import { ContentFile, ContentImage, ContentInfo, ContentList, ContentPageDocumentLean, ContentText } from "../../../../../../server/database/models/content/content.types";

// Extend interfaces for Form options

interface Reference {
  placeholderRef: string;
  typeRef: string;
  alertRef: string;
}

export interface ContentInfoExt extends ContentInfo {
  placeholderTitle: string,
  typeTitle: string;
  alertTitle: string,
  placeholderSubtitle: string,
  typeSubtitle: string,
  alertSubtitle: string,
  placeholderText: string;
  typeText: string;
  alertText: string;
  placeholderList: string,
  typeList: string,
  alertList: string,
}
export interface ContentTextExt extends ContentText, Reference {
  placeholderText: string;
  typeText: string;
  alertText: string;
  placeholderHeader: string;
  typeHeader: string;
  alertHeader: string;
}
export interface ContentListExt extends ContentList, Reference {
  placeholderTitle: string;
  typeTitle: string;
  alertTitle: string;
  placeholderItem: string;
  typeItem: string;
  alertItem: string;
}
export interface ContentImageExt extends ContentImage, Reference {
  placeholderTitle: string;
  typeTitle: string;
  alertTitle: string;
  alertFile: string;
}
export interface ContentFileExt extends ContentFile, Reference {
  placeholderTitle: string;
  typeTitle: string;
  alertTitle: string;
  alertFile: string;
}
export interface ContentImageSubmit extends ContentImage {
  imageUpdate: Blob;
}
export interface ContentFileSubmit extends ContentFile {
  fileUpdate: Blob;
}
export interface ContentPageDocumentExt extends ContentPageDocumentLean {
  info: ContentInfoExt;
  texts: ContentTextExt[];
  lists: ContentListExt[];
  images: ContentImageExt[];
  files: ContentFileExt[];
}
export interface ContentPageLeanSubmit extends ContentPageDocumentLean {
  images: ContentImageSubmit[];
  files: ContentFileSubmit[];
}
