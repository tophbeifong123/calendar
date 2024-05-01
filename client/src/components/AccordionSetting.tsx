import React, { useState, useEffect } from "react";
import { Accordion, Checkbox, ListGroup } from "flowbite-react";

export function AccordionSetting({ events, filterClass, filterExam }: any) {
  const [checkedSubjects, setCheckedSubjects] = useState<{ [key: string]: boolean }>(() => {
    if (typeof window !== 'undefined') {
      const storedSubjects = localStorage.getItem("checkedSubjects");
      if (storedSubjects) {
        return JSON.parse(storedSubjects);
      } else {
        const initialSubjects: { [key: string]: boolean } = {};
        [...filterClass, ...filterExam].forEach((subject: any) => {
          initialSubjects[subject.subjectCode] = true;
        });
        localStorage.setItem("checkedSubjects", JSON.stringify(initialSubjects));
        return initialSubjects;
      }
    } else {
      return {};
    }
  });

  const toggleCheckbox = (subjectCode: string) => {
    setCheckedSubjects(prevState => {
      const newState = { ...prevState, [subjectCode]: !prevState[subjectCode] };
      if (typeof window !== 'undefined') {
        localStorage.setItem("checkedSubjects", JSON.stringify(newState));
      }
      return newState;
    });
  };

  const displayedSubjects: string[] = [];

  return (
    <div className="flex flex-col justify-center mx-auto">
      <ListGroup className="w-48 mt-20 ">
        <ListGroup.Item><a className="mx-auto">รายวิชาของฉัน</a></ListGroup.Item>
        {(filterClass.length > 0 || filterExam.length > 0) ? (
          <>
            {filterClass.map((subject: any) => {
              if (!displayedSubjects.includes(subject.subjectCode)) {
                displayedSubjects.push(subject.subjectCode);
                return (
                  <ListGroup.Item key={subject.id} className="flex items-center justify-between">
                    <span className="flex-grow">{subject.subjectCode}</span>
                    <Checkbox
                      defaultChecked={checkedSubjects[subject.subjectCode]}
                      onChange={() => toggleCheckbox(subject.subjectCode)}
                    />
                  </ListGroup.Item>
                );
              }
              return null;
            })}
            {filterExam.map((subject: any) => {
              if (!displayedSubjects.includes(subject.subjectCode)) {
                displayedSubjects.push(subject.subjectCode);
                return (
                  <ListGroup.Item key={subject.id} className="flex items-center justify-between">
                    <span className="flex-grow">{subject.subjectCode}</span>
                    <Checkbox
                      defaultChecked={checkedSubjects[subject.subjectCode]}
                      onChange={() => toggleCheckbox(subject.subjectCode)}
                    />
                  </ListGroup.Item>
                );
              }
              return null;
            })}
          </>
        ) : (
          <ListGroup.Item>ไม่มีข้อมูลการเรียนหรือการสอบ</ListGroup.Item>
        )}
      </ListGroup>
    </div>
  );
}
