package com.store.dev.web.api;

import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.store.dev.dto.AdmDTO;
import com.store.dev.dto.ResponseDTO;
import com.store.dev.dto.SearchDTO;
import com.store.dev.dto.SearchResDTO;
import com.store.dev.dto.StoreDTO;
import com.store.dev.service.StoreService;

import io.github.bonigarcia.wdm.WebDriverManager;
import jakarta.annotation.Resource;

@RestController
@RequestMapping("/api/store")
public class StoreApiController {

    @Resource
    private StoreService storeService;

    @GetMapping("")
    public ResponseDTO searchList(SearchDTO searchDTO) {
        ResponseDTO res = new ResponseDTO();
        SearchResDTO resDTO = new SearchResDTO();

        List<StoreDTO> list = null;
        List<AdmDTO> sdList = null;
        List<AdmDTO> sggList = null;
        int count;

        if (!searchDTO.getType1().equals("my")) {
            list = storeService.selectListStore(searchDTO);
            count = storeService.selectListStoreByCount(searchDTO);
            sdList = storeService.selectListSdCluster(searchDTO);
            sggList = storeService.selectListSggCluster(searchDTO);

        } else {
            list = storeService.selectListStoreByDistance(searchDTO);
            count = storeService.selectListStoreCountByDistance(searchDTO);
        }

        resDTO.setList(list);
        resDTO.setCount(count);

        res.setStatus("success");
        res.setErrCode(null);
        res.setResult(list);
        res.setSdResult(sdList);
        res.setSggResult(sggList);
        res.setResultCnt(count);
        return res;
    }

    @GetMapping("/info")
    public ResponseDTO getMethodName(@RequestParam int seq, @RequestParam String category, @RequestParam String name,
            @RequestParam String doro, @RequestParam String jibeon) throws InterruptedException {
        ResponseDTO res = new ResponseDTO();

        WebDriverManager.chromedriver().setup();
        WebDriver driver = new ChromeDriver();
        JavascriptExecutor js = (JavascriptExecutor) driver;

        // doro와 jibeon 각각에서 첫 두 단어를 추출
        String[] doroParts = doro.split(" ");
        String doroFirstTwoWords = doroParts.length > 1 ? doroParts[0] + " " + doroParts[1] : doro;

        String[] jibeonParts = jibeon.split(" ");
        String jibeonFirstTwoWords = jibeonParts.length > 1 ? jibeonParts[0] + " " + jibeonParts[1] : jibeon;

        // driver.get("https://www.diningcode.com/");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));

        // // 검색 필드를 찾아 검색어 입력
        // WebElement searchField =
        // driver.findElement(By.xpath("//*[@id=\"root\"]/header/div/div/div[2]/div/input"));
        // searchField.sendKeys(name + " " + doroFirstTwoWords);
        // WebElement click1 =
        // wait.until(ExpectedConditions.elementToBeClickable(By.xpath("/html/body/div/header/div/div/div[2]/div/button[2]")));
        // js.executeScript("arguments[0].click();", click1);

        // // 1. 현재 열려있는 모든 창의 핸들을 저장합니다.
        // Set<String> existingWindowHandles = driver.getWindowHandles();

        // WebElement click2 =
        // driver.findElement(By.xpath("//*[@id=\"root\"]/div/main/div[2]/div[3]/ol/li/a/div[1]/div/div[1]/h1"));
        // click2.click();

        // // 새 창이 열릴 때까지 기다립니다.
        // boolean newWindowFound = new WebDriverWait(driver,
        // Duration.ofSeconds(15)).until((WebDriver d) -> {
        // Set<String> currentWindowHandles = d.getWindowHandles();
        // currentWindowHandles.removeAll(existingWindowHandles); // 기존 핸들을 제거합니다.
        // return currentWindowHandles.size() == 1; // 정확히 하나의 새 창이 열렸는지 확인합니다.
        // });

        // if (newWindowFound) {
        // // 새 창으로 전환합니다.
        // String newWindowHandle = driver.getWindowHandles().stream()
        // .filter(handle -> !existingWindowHandles.contains(handle))
        // .findFirst()
        // .orElseThrow(() -> new RuntimeException("새 창 핸들을 찾을 수 없습니다."));
        // driver.switchTo().window(newWindowHandle);

        // // 새 창에서의 작업을 수행합니다.
        // System.out.println("새 창 URL: " + driver.getCurrentUrl());
        // } else {
        // System.out.println("새 창이 시간 내에 열리지 않았습니다.");
        // }

        // WebElement click3 =
        // driver.findElement(By.xpath("//*[@id=\"div_detail\"]/div[3]/p[2]/a/span"));
        // click3.click();

        // // 메뉴 시작
        // List<WebElement> menuElements =
        // driver.findElements(By.className("menu-info"));

        // List<String> menuList = new ArrayList<>();
        // for (WebElement menuElement : menuElements) {
        // menuList.add(menuElement.getText());
        // }
        // // 메뉴 종료

        // // 리뷰 시작
        // List<WebElement> reviewElements =
        // driver.findElements(By.className("latter-graph"));

        // List<String> reviewList = new ArrayList<>();
        // for (WebElement reviewElement : reviewElements) {
        // reviewList.add(reviewElement.getText());
        // }
        // // 리뷰 종료

        // // 리뷰 이미지 시작
        // // 이미지 크롤링 시작
        // List<WebElement> imageElements =
        // driver.findElements(By.cssSelector(".photo_box img"));

        // List<String> imageList = new ArrayList<>();
        // for (WebElement imageElement : imageElements) {
        // imageList.add(imageElement.getAttribute("src"));
        // }

        // 리뷰 이미지 종료

        // 카카오맵에서 검색하기
System.out.println("새로운시작 카카오맵에서 검색하기");
driver.get("https://m.map.kakao.com/actions/searchView?q=" + name + " " + doroFirstTwoWords);
WebElement firstResult = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(".list_result li")));
firstResult.click();

// 페이지가 로드될 때까지 대기합니다.
wait.until(ExpectedConditions.presenceOfElementLocated(By.className("cont_grade")));

// 현재 URL을 가져와 출력합니다.
String currentUrl = driver.getCurrentUrl();
System.out.println("현재 URL: " + currentUrl);

// 블로그 후기 가져오기
List<WebElement> blogReviewElements = driver.findElements(By.cssSelector(".list_review li"));
List<Map<String, String>> blogReviewList = new ArrayList<>();

for (WebElement blogReviewElement : blogReviewElements) {
    Map<String, String> reviewData = new HashMap<>();
    reviewData.put("title", blogReviewElement.findElement(By.cssSelector(".tit_review")).getText());
    reviewData.put("content", blogReviewElement.findElement(By.cssSelector(".txt_review")).getText());
    reviewData.put("author", blogReviewElement.findElement(By.cssSelector(".loss_word")).getText());
    reviewData.put("date", blogReviewElement.findElement(By.cssSelector(".review_date")).getText());
    reviewData.put("link", blogReviewElement.findElement(By.cssSelector("a.link_review")).getAttribute("href"));

    List<WebElement> photoElements = blogReviewElement.findElements(By.cssSelector(".photo_slider .item_photo img"));
    List<String> photos = new ArrayList<>();
    for (WebElement photoElement : photoElements) {
        photos.add(photoElement.getAttribute("src"));
    }
    reviewData.put("photos", String.join(",", photos));

    blogReviewList.add(reviewData);
}


// 카카오사진
System.out.println("카카오사진======");
wait.until(ExpectedConditions.presenceOfElementLocated(By.className("link_photo"))); // 요소가 로드될 때까지 대기
List<WebElement> listPhotoElements = driver.findElements(By.className("link_photo"));
List<String> photoHrefList = new ArrayList<>();
for (WebElement listPhotoElement : listPhotoElements) {
    String href = listPhotoElement.getAttribute("href");
    photoHrefList.add(href);
    System.out.println(href);
}
System.out.println("카카오사진======");

// 전화번호
System.out.println("전화번호=====");
List<WebElement> numberElements = driver.findElements(By.className("num_contact"));
String numberList = null;
for (WebElement element : numberElements) {
    numberList = element.getText();
}
System.out.println("전화번호=======");

// 영업시간
System.out.println("영업시간=======");
List<WebElement> timeElements = driver.findElements(By.className("realtime_wrap"));
String timeList = null;
for (WebElement element : timeElements) {
    System.out.println(element.getText());
    timeList = element.getText();
}
System.out.println("영업시간=======");

Thread.sleep(2000); // 추가 대기 시간을 넣어 안정성을 높임

// 음식메뉴 이동
System.out.println("음식메뉴======");
driver.get(currentUrl + "#menuInfo");
wait.until(ExpectedConditions.presenceOfElementLocated(By.className("info_menu"))); // 요소가 로드될 때까지 대기
Thread.sleep(2000); // 페이지가 완전히 로드될 때까지 추가 대기
List<WebElement> menuElements = driver.findElements(By.className("info_menu")); // 요소를 다시 찾음
List<String> menuList = new ArrayList<>();
for (WebElement element : menuElements) {
    WebElement nameElement = element.findElement(By.className("name_menu"));
    WebElement priceElement = element.findElement(By.className("price_menu"));
    String menuText = nameElement.getText() + " " + priceElement.getText();
    menuList.add(menuText);
    System.out.println(menuText);
}
System.out.println("음식메뉴======");


// 카카오리뷰 이동
System.out.println("카카오리뷰======");
driver.get(currentUrl + "#comment"); // 리뷰를 가져올 새로운 URL
wait.until(ExpectedConditions.presenceOfElementLocated(By.className("txt_comment"))); // 요소가 로드될 때까지 대기
Thread.sleep(2000); // 페이지가 완전히 로드될 때까지 추가 대기
List<WebElement> kakaoReviewElements = driver.findElements(By.className("txt_comment")); // 요소를 다시 찾음
List<String> kakaoReviewList = new ArrayList<>();
for (WebElement kakaoReviewElement : kakaoReviewElements) {
    kakaoReviewList.add(kakaoReviewElement.getText());
    System.out.println(kakaoReviewElement.getText());
}
System.out.println("카카오리뷰======");


// 결과를 맵에 저장
Map<String, Object> result = new HashMap<>();
if (menuList.size() > 0) {
    result.put("menuList", menuList);
}
if (kakaoReviewList.size() > 0) {
    result.put("kakaoReviewList", kakaoReviewList);
}
if (photoHrefList.size() > 0) {
    result.put("photoHrefList", photoHrefList); // 사진 href 리스트를 결과에 추가
}
if (numberList != null) {
    result.put("numberList", numberList);
}
if (timeList != null) {
    result.put("timeList", timeList);
}

if (!blogReviewList.isEmpty()) {
     result.put("blogReviewList", blogReviewList);
}

res.setStatus("success");
res.setResult(result);
driver.quit();
return res;

    }

}
