export type TaskItem = {
  id: number;
  run_time: string;
  name: string;
  desc: string;
  status: number;
  remarks: string;
};

export type TaskList = {
  data?: TaskItem[];
  total?: number;
  success?: boolean;
};
