"use client";

import { Accordion, Checkbox, ListGroup } from "flowbite-react";

export function AccordionSetting({ events, filterClass, filterExam }: any) {
  console.log("yu", filterClass);
  
  const displayedSubjectsClass: string[] = [];
  const displayedSubjectsExam: string[] = [];
  
  return (
    <div className="flex flex-col justify-center mx-auto">
      <ListGroup className="w-48 mt-20 ">
      <ListGroup.Item><a className="mx-auto">การเรียนของฉัน</a></ListGroup.Item>
        {filterClass.map((subject: any) => {
          if (!displayedSubjectsClass.includes(subject.subjectCode)) {
            displayedSubjectsClass.push(subject.subjectCode);
            return (
              <ListGroup.Item key={subject.id} className="flex items-center justify-between">
                <span className="flex-grow">{subject.subjectCode}</span>
                <Checkbox defaultChecked />
              </ListGroup.Item>
            );
          }
          return null;
        })}
      </ListGroup>

      <ListGroup className="w-48 mt-10 ">
      <ListGroup.Item><a className="mx-auto">การสอบของฉัน</a></ListGroup.Item>
        {filterExam.map((subject: any) => {
          if (!displayedSubjectsExam.includes(subject.subjectCode)) {
            displayedSubjectsExam.push(subject.subjectCode);
            return (
              <ListGroup.Item key={subject.id} className="flex items-center justify-between">
                <span className="flex-grow">{subject.subjectCode}</span>
                <Checkbox defaultChecked />
              </ListGroup.Item>
            );
          }
          return null;
        })}
      </ListGroup>
    </div>
  );
}
