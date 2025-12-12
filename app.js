import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ⚠️ REMPLACEZ PAR VOS VALEURS
const supabaseUrl = "https://hwvemozmiyftacxjqyzf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dmVtb3ptaXlmdGFjeGpxeXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NDM3MjUsImV4cCI6MjA4MTExOTcyNX0.VXBO142jnWiPFehiSlUbf8O00MrDt_hmAnbB39vVBP8";

const supabase = createClient(supabaseUrl, supabaseKey);

// ELEMENTS
const authDiv = document.getElementById("auth");
const appDiv = document.getElementById("app");
const userP = document.getElementById("user");
const itemsUl = document.getElementById("items");

const email = document.getElementById("email");
const password = document.getElementById("password");

// AUTH
document.getElementById("login").onclick = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });
  if (error) alert(error.message);
};

document.getElementById("register").onclick = async () => {
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  });
  if (error) alert(error.message);
};

document.getElementById("logout").onclick = async () => {
  await supabase.auth.signOut();
};

// ITEMS
document.getElementById("addItem").onclick = async () => {
  const input = document.getElementById("itemInput");
  if (!input.value) return;

  await supabase.from("items").insert({
    title: input.value
  });

  input.value = "";
  loadItems();
};

async function loadItems() {
  const { data } = await supabase.from("items").select("*").order("created_at");
  itemsUl.innerHTML = "";
  data.forEach(i => {
    const li = document.createElement("li");
    li.textContent = i.title;
    itemsUl.appendChild(li);
  });
}

// SESSION
supabase.auth.onAuthStateChange((_event, session) => {
  if (session) {
    authDiv.style.display = "none";
    appDiv.style.display = "block";
    userP.textContent = session.user.email;
    loadItems();
  } else {
    authDiv.style.display = "block";
    appDiv.style.display = "none";
  }
});
