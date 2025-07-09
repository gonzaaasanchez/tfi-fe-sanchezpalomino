import { ReactNode } from 'react';

export interface Layout {
  children?: ReactNode;
}
export interface CourseLayoutProps extends Layout {
  courseId?: number;
}

export interface PublicLayout extends Layout {
  bg?: string;
  bgImage?: string;
}
