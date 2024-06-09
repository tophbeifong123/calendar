import React, { useState } from "react";
import { Checkbox, ListGroup } from "flowbite-react";

export function AccordionSetting({
  events,
  filterClass,
  filterExam,
  test,
}: any) {
  const [checkedSubjects, setCheckedSubjects] = useState<{
    [key: string]: boolean;
  }>(() => {
    if (typeof window !== "undefined") {
      const storedSubjects = localStorage.getItem("checkedSubjects");
      if (storedSubjects) {
        return JSON.parse(storedSubjects);
      } else {
        const initialSubjects: { [key: string]: boolean } = {};
        [...filterClass, ...filterExam].forEach((subject: any) => {
          initialSubjects[subject.subjectCode] = true;
          initialSubjects["000-000"] = false;
        });

        localStorage.setItem(
          "checkedSubjects",
          JSON.stringify(initialSubjects)
        );
        return initialSubjects;
      }
    } else {
      return {};
    }
  });

  const toggleCheckbox = (subjectCode: string) => {
    setCheckedSubjects((prevState) => {
      const newState = { ...prevState, [subjectCode]: !prevState[subjectCode] };
      if (typeof window !== "undefined") {
        localStorage.setItem("checkedSubjects", JSON.stringify(newState));
      }
      test();
      return newState;
    });
  };

  const displayedSubjects: string[] = [];

  return (
    <div className="flex flex-col justify-center bg-white p-2 rounded-lg shadow-md w-[170px]">
      <h2 className="flex flex-row text-md font-base text-center mb-2 mx-auto ">
        รายวิชาของฉัน
      </h2>
      <ListGroup>
        {filterClass.length > 0 || filterExam.length > 0 ? (
          <>
            {filterClass.map((subject: any) => {
              if (!displayedSubjects.includes(subject.subjectCode)) {
                displayedSubjects.push(subject.subjectCode);
                return (
                  <ListGroup.Item
                    key={subject.id}
                    className="flex items-center justify-between hover:bg-gray-100  rounded-md transition-colors duration-200"
                  >
                    <span className=" flex-grow text-sm font-medium text-gray-700">
                      {subject.subjectCode}
                    </span>
                    <Checkbox
                      defaultChecked={checkedSubjects[subject.subjectCode]}
                      onChange={() => toggleCheckbox(subject.subjectCode)}
                      className="ml-2"
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
                  <ListGroup.Item
                    key={subject.id}
                    className="flex items-center justify-between hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    <span className="flex-grow text-sm font-medium text-gray-700">
                      {subject.subjectCode}
                    </span>
                    <Checkbox
                      defaultChecked={checkedSubjects[subject.subjectCode]}
                      onChange={() => toggleCheckbox(subject.subjectCode)}
                      className="ml-2"
                    />
                  </ListGroup.Item>
                );
              }
              return null;
            })}
          </>
        ) : (
          <ListGroup.Item className="text-center text-gray-500">
            ไม่มีข้อมูลการเรียนหรือการสอบ
          </ListGroup.Item>
        )}
      </ListGroup>
    </div>
  );
}
