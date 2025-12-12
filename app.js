import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ⚠️ TES VRAIES VALEURS (déjà bonnes chez toi)
const supabaseUrl = "https://hwvemozmiyftacxjqyzf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dmVtb3ptaXlmdGFjeGpxeXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NDM3MjUsImV4cCI6MjA4MTExOTcyNX0.VXBO142jnWiPFehiSlUbf8O00MrDt_hmAnbB39vVBP8"; // laisse la tienne
const supabase = createClient(supabaseUrl, supabaseKey);

// ELEMENTS
const authDiv = document.getElementById("auth");
const appDiv = document.getElementById("app");
const userP = document.getElementById("user");
const itemsUl = document.getElementById("items");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const newItemInput = document.getElementById("newItem");

// AUTH
document.getElementById("login").onclick = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value
  });
  if (error) alert(error.message);
};

document.getElementById("register").onclick = async () => {
  const { error } = await supabase.auth.signUp({
    email: emailInput.value,
    password: passwordInput.value
  });
  if (error) alert(error.message);
};

document.getElementById("logout").onclick = async () => {
  await supabase.auth.signOut();
};

// SESSION
supabase.auth.onAuthStateChange((_, session) => {
  if (session) {
    authDiv.style.display = "none";
    appDiv.style.display = "block";
    userP.textContent = session.user.email;
    loadItems();
  } else {
    authDiv.style.display = "block";
    appDiv.style.display = "none";
    itemsUl.innerHTML = "";
  }
});

// LOAD ITEMS
async function loadItems() {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    alert(error.message);
    return;
  }

  itemsUl.innerHTML = "";

  data.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.content;

    const del = document.createElement("button");
    del.textContent = "❌";
    del.onclick = () => deleteItem(item.id);

    li.appendChild(del);
    itemsUl.appendChild(li);
  });
}

// ADD ITEM
document.getElementById("addItem").onclick = async () => {
  const content = newItemInput.value.trim();
  if (!content) return;

  const { error } = await supabase
    .from("items")
    .insert({ content });

  if (error) {
    alert(error.message);
    return;
  }

  newItemInput.value = "";
  loadItems();
};

// DELETE ITEM
async function deleteItem(id) {
  const { error } = await supabase
    .from("items")
    .delete()
    .eq("id", id);

  if (error) alert(error.message);
  else loadItems();
}
