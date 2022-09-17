//posting a query
function preventBack() {
  window.history.forward();
}

setTimeout("preventBack()", 0);

window.onunload = function () {
  null;
};

const inputQueryButton = document.querySelector(".inputQuery");
const inputQuery = document.querySelector("#inputQuery");
async function postFunction() {
  {
    if (inputQuery.value != "") {
      await fetch(`/studentpage/query/insert?query=${inputQuery.value}`);
      const div = document.createElement("div");
      const userinfo = await fetch(
        `/studentpage/userinfo?id=${document.querySelector(".id").innerHTML}`
      );
      const queryField = document.querySelector(".queries");
      const fuserinfo = await userinfo.json();
      div.innerHTML = `<div class="query-header">${fuserinfo[0].userId}</div>
      <div class="query">${inputQuery.value}</div>
      <div class="query-links"><span class="like" style="font-size:2.2em;margin-top: -3px;">♡</span>
              &nbsp;<span class="likeCount like">0</span>&nbsp;&nbsp; <i class="material-icons commentButton">comment</i>
      </div>`;
      div.classList.add("query-box");
      queryField.prepend(div);
      inputQuery.value = "";
      queryField.innerHTML = "";
      queryData();
    }
  }
}
document.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    postFunction();
  }
});
inputQueryButton.addEventListener("click", postFunction);
const color = () => {
  const x = Math.floor(Math.random() * 256);
  if (x < 100) return 150;
  return x;
};
async function queryData() {
  //to append all queries
  const data = await fetch("/studentpage/querydata");
  const fdata = await data.json();
  const queryField = document.querySelector(".queries");
  let queryfieldhtml = "";
  queryField.innerHTML = "<h1 class='loading'>loading...</h1.";
  for (let x = fdata.length - 1; x >= 0; x--) {
    ////console.log(fdata[x]);
    let temp = `<div class="query-box"><div class="query-header">${fdata[x].uid}</div>
    <div class="query">${fdata[x].query}</div><div class="qid"style="display:none;">${fdata[x].id}</div>
    <div class="query-links"><span class="like" style="font-size:2.2em;margin-top: -3px;">♡</span> 
            &nbsp;<span class="likeCount ">${fdata[x].likeCount}</span>&nbsp;&nbsp; <i class="material-icons commentButton">comment</i>
    </div></div>`;
    queryfieldhtml += temp;
    // //console.log(temp);
  }
  queryField.innerHTML = queryfieldhtml;
  //to add like and comment functionality
  const commentButton = document.querySelectorAll(".commentButton");
  const commentsMain = document.querySelector(".comments-main");
  const likeCount = document.querySelectorAll(".likeCount");
  const like = document.querySelectorAll(".like");
  for (let i = 0; i < like.length; i++) {
    like[i].addEventListener("click", async () => {
      if (like[i].innerHTML === "♥") {
        like[i].innerHTML = "♡";
        let tempCnt = parseInt(likeCount[i].innerHTML);
        tempCnt = tempCnt - 1;
        likeCount[i].innerHTML = `${tempCnt}`;
        await fetch(
          `/studentpage/like/remove/?qid=${
            document.querySelectorAll(".qid")[i].innerHTML
          }&&uid=${document.querySelector(".id").innerHTML}`
        );
      } else {
        like[i].innerHTML = "♥";
        let tempCnt = parseInt(likeCount[i].innerHTML);
        tempCnt = tempCnt + 1;
        likeCount[i].innerHTML = `${tempCnt}`;
        await fetch(
          `/studentpage/like/add/?qid=${
            document.querySelectorAll(".qid")[i].innerHTML
          }&&uid=${document.querySelector(".id").innerHTML}`
        );
      }
    });
    const allComments = document.querySelector(".all-comments");
    commentButton[i].addEventListener("click", async () => {
      commentsMain.style.display = "flex";
      document.querySelector(".queryId").innerHTML =
        document.querySelectorAll(".qid")[i].innerHTML;
      allComments.innerHTML = "";
      const commentsDAta = await fetch(
        `/studentpage/getallcomments?qid=${
          document.querySelectorAll(".qid")[i].innerHTML
        }`
      );
      const fcommentsDAta = await commentsDAta.json();
      allComments.innerHTML = "<h5 class='loading'>loading...</h5>";
      let commentshtml = "";
      for (let j = 0; j < fcommentsDAta.length; j++) {
        commentshtml += `<div class="comment-box"><div class="comment-header">${fcommentsDAta[j].uid}</div>
        <div class="comment-data">${fcommentsDAta[j].comment}</div></div>`;
      }
      allComments.innerHTML = commentshtml;
    });
  }
  //to count the like
  const check = await fetch(`/studentpage/checklike`);
  const fcheck = await check.json();
  let likeCheck = [];
  for (let i = 0; i < fcheck.length; i++) {
    likeCheck.push(fcheck[i].qid);
  }
  // //console.log(likeCount);
  for (let i = 0; i < document.querySelectorAll(".qid").length; i++) {
    //console.log(document.querySelectorAll(".qid")[i].innerHTML);
    if (
      likeCheck.indexOf(document.querySelectorAll(".qid")[i].innerHTML) >= 0
    ) {
      like[i].innerHTML = "♥";
    } else {
      like[i].innerHTML = "♡";
    }
  }
}
/*<div class="query-box">
                                <div class="query-header">names</div>
                                <div class="query">query</div>
                                <div class="query-links"><span class="like" style="font-size:2.2em;margin-top: -3px;">♡</span> 
                                        &nbsp; <i class="material-icons commentButton">comment</i>
                                </div>
                        </div> */
queryData();
//comments---section----
const commentClose = document.querySelector(".comments-header");
const commentMain = document.querySelector(".comments-main");
function clearComment() {
  document.querySelector("#comment").value = "";
}
commentClose.addEventListener("click", () => {
  commentMain.style.display = "none";
  clearComment();
});
commentMain.addEventListener("click", (e) => {
  if (e.target.id == "comments-main") {
    commentMain.style.display = "none";
    clearComment();
  }
});
//-----------------------

const submitComment = document.querySelector(".submit-comment");
const commentInput = document.querySelector("#comment");
submitComment.addEventListener("click", async () => {
  if (commentInput.value != "") {
    const uComment = commentInput.value;
    commentInput.value = "";
    await fetch(
      `/studentpage/add/comment/?comment=${uComment}&&uid=${
        document.querySelector(".id").innerHTML
      }&&qid=${document.querySelector(".queryId").innerHTML}`
    );
    const allComments = document.querySelector(".all-comments");
    const div = document.createElement("div");
    div.classList.add("comment-box");
    const userinfo = await fetch(
      `/studentpage/userinfo?id=${document.querySelector(".id").innerHTML}`
    );
    const fuserinfo = await userinfo.json();
    div.innerHTML = `<div class="comment-header">${fuserinfo[0].userId}</div>
        <div class="comment-data">${uComment}</div>`;
    allComments.prepend(div);
  }
});

//---------------------------------------------------------------------------
async function profilequeryData() {
  //to append all queries
  const userinfo = await fetch(
    `/studentpage/userinfo?id=${document.querySelector(".id").innerHTML}`
  );
  const fuserinfo = await userinfo.json();
  document.querySelector(".profile-name").innerHTML = fuserinfo[0].userId;
  const data = await fetch(
    `/studentpage/profilequerydata?uid=${fuserinfo[0].userId}`
  );
  const fdata = await data.json();
  //console.log(fdata);
  const queryField = document.querySelector(".profile-all-queries");
  for (let x = 0; x < fdata.length; x++) {
    const div = document.createElement("div");
    div.innerHTML = `
    <div class="query">${fdata[x].query}</div><div class="qid"style="display:none;">${fdata[x].id}</div>
    <div class="query-links"><span class="like" style="font-size:2.2em;margin-top: -3px;">♡</span> 
            &nbsp;<span class="likeCount ">${fdata[x].likeCount}</span>&nbsp;&nbsp; <i class="material-icons commentButton">comment</i>
    </div>`;
    div.classList.add("query-box");
    queryField.prepend(div);
  }
  //to add like and comment functionality
  const commentButton = document.querySelectorAll("i");
  const commentsMain = document.querySelector(".comments-main");
  const likeCount = document.querySelectorAll(".likeCount");
  const like = document.querySelectorAll(".like");
  for (let i = 0; i < like.length; i++) {
    like[i].addEventListener("click", async () => {
      if (like[i].innerHTML === "♥") {
        like[i].innerHTML = "♡";
        let tempCnt = parseInt(likeCount[i].innerHTML);
        tempCnt = tempCnt - 1;
        likeCount[i].innerHTML = `${tempCnt}`;
        await fetch(
          `/studentpage/like/remove/?qid=${
            document.querySelectorAll(".qid")[i].innerHTML
          }&&uid=${document.querySelector(".id").innerHTML}`
        );
      } else {
        like[i].innerHTML = "♥";
        let tempCnt = parseInt(likeCount[i].innerHTML);
        tempCnt = tempCnt + 1;
        likeCount[i].innerHTML = `${tempCnt}`;
        await fetch(
          `/studentpage/like/add/?qid=${
            document.querySelectorAll(".qid")[i].innerHTML
          }&&uid=${document.querySelector(".id").innerHTML}`
        );
      }
    });
    const allComments = document.querySelector(".all-comments");
    commentButton[i].addEventListener("click", async () => {
      commentsMain.style.display = "flex";
      document.querySelector(".queryId").innerHTML =
        document.querySelectorAll(".qid")[i].innerHTML;
      allComments.innerHTML = "";
      const commentsDAta = await fetch(
        `/studentpage/getallcomments?qid=${
          document.querySelectorAll(".qid")[i].innerHTML
        }`
      );
      const fcommentsDAta = await commentsDAta.json();
      for (let j = 0; j < fcommentsDAta.length; j++) {
        const div = document.createElement("div");
        div.classList.add("comment-box");
        const userinfo = await fetch(
          `/studentpage/userinfo?id=${fcommentsDAta[j].uid}`
        );
        const fuserinfo = await userinfo.json();
        div.innerHTML = `<div class="comment-header">${fuserinfo[0].userId}</div>
        <div class="comment-data">${fcommentsDAta[j].comment}</div>`;
        allComments.prepend(div);
      }
    });
  }
  //to count the like

  const check = await fetch(`/studentpage/checklike`);
  const fcheck = await check.json();
  let likeCheck = [];
  for (let i = 0; i < fcheck.length; i++) {
    likeCheck.push(fcheck[i].qid);
  }
  // //console.log(likeCount);
  for (let i = 0; i < document.querySelectorAll(".qid").length; i++) {
    //console.log(document.querySelectorAll(".qid")[i].innerHTML);
    if (
      likeCheck.indexOf(document.querySelectorAll(".qid")[i].innerHTML) >= 0
    ) {
      like[i].innerHTML = "♥";
    } else {
      like[i].innerHTML = "♡";
    }
  }
}
/*<div class="query-box">
                                <div class="query-header">names</div>
                                <div class="query">query</div>
                                <div class="query-links"><span class="like" style="font-size:2.2em;margin-top: -3px;">♡</span> 
                                        &nbsp; <i class="material-icons commentButton">comment</i>
                                </div>
                        </div> */

const profileMain = document.querySelector(".profile-main");
const profileButton = document.querySelector(".profile-button");
const profileexit = document.querySelector("#profile-exit");
profileButton.addEventListener("click", () => {
  profilequeryData();
  profileMain.style.display = "flex";
});
profileMain.addEventListener("click", (e) => {
  if (e.target.id == "profile-main") {
    profileMain.style.display = "none";
  }
});
profileexit.addEventListener("click", () => {
  profileMain.style.display = "none";
});
const logout = document.querySelector(".logout-button");
