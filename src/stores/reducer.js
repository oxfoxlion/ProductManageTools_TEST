export const initial = {
  fileName: "",
  rows: [],
  headers: [],
  selectedIndex: 0,
  customMap: {},
};

export function csvReducer(state, action) {
  switch (action.type) {
    case "LOAD_CSV": {
      const { rows, fileName } = action.payload;
      const headers = rows.length ? Object.keys(rows[0]).map(String) : [];
      const nextMap = { ...state.customMap };
      Object.keys(nextMap).forEach((k) => {
        if (nextMap[k] && !headers.includes(nextMap[k])) nextMap[k] = "";
      });
      return { ...state, rows, headers, fileName, selectedIndex: 0, customMap: nextMap };
    }
    case "SET_INDEX":
      return { ...state, selectedIndex: action.payload };
    case "SET_CUSTOM_MAP":
      return { ...state, customMap: action.payload };
    default:
      return state;
  }
}
